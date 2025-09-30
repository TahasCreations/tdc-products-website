-- Macro to extract date parts from a date column
{% macro get_date_parts(date_column) %}
    extract(year from {{ date_column }}) as year,
    extract(month from {{ date_column }}) as month,
    extract(day from {{ date_column }}) as day,
    extract(dayofweek from {{ date_column }}) as day_of_week,
    extract(dayofyear from {{ date_column }}) as day_of_year,
    extract(week from {{ date_column }}) as week,
    extract(quarter from {{ date_column }}) as quarter
{% endmacro %}

