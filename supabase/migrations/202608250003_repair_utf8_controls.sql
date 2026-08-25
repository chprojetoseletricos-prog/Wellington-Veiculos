create or replace function private.repair_utf8_control_mojibake(input text)
returns text
language plpgsql
immutable
strict
set search_path = ''
as $$
begin
  if strpos(input, chr(195)) = 0
    and strpos(input, chr(194)) = 0
    and strpos(input, chr(226)) = 0 then
    return input;
  end if;

  begin
    return convert_from(convert_to(input, 'WIN1252'), 'UTF8');
  exception
    when character_not_in_repertoire or untranslatable_character then
      begin
        return convert_from(convert_to(input, 'LATIN1'), 'UTF8');
      exception
        when character_not_in_repertoire or untranslatable_character then
          return input;
      end;
  end;
end;
$$;

do $$
declare
  column_record record;
begin
  for column_record in
    select table_schema, table_name, column_name
    from information_schema.columns
    where table_schema = 'public'
      and data_type in ('text', 'character varying', 'character')
      and is_generated = 'NEVER'
  loop
    execute format(
      'update %I.%I set %I = private.repair_utf8_control_mojibake(%I) where strpos(%I, chr(195)) > 0 or strpos(%I, chr(194)) > 0 or strpos(%I, chr(226)) > 0',
      column_record.table_schema,
      column_record.table_name,
      column_record.column_name,
      column_record.column_name,
      column_record.column_name,
      column_record.column_name,
      column_record.column_name
    );
  end loop;
end;
$$;

update public.site_settings
set value = to_jsonb(private.repair_utf8_control_mojibake(value #>> '{}'))
where jsonb_typeof(value) = 'string'
  and (
    strpos(value #>> '{}', chr(195)) > 0
    or strpos(value #>> '{}', chr(194)) > 0
    or strpos(value #>> '{}', chr(226)) > 0
  );

drop function private.repair_utf8_control_mojibake(text);
