-- Macro to calculate growth rate between two values
{% macro calculate_growth_rate(current_value, previous_value) %}
    case 
        when {{ previous_value }} > 0 then (({{ current_value }} - {{ previous_value }}) / {{ previous_value }}) * 100
        else null
    end
{% endmacro %}

