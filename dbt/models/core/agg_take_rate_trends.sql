-- Take rate trends analysis
with daily_take_rates as (
    select
        tenant_id,
        order_date,
        order_year,
        order_month,
        order_day_of_week,
        avg(avg_take_rate) as daily_avg_take_rate,
        avg(avg_effective_take_rate) as daily_avg_effective_take_rate,
        sum(total_gmv) as daily_gmv,
        sum(total_commission) as daily_commission,
        count(distinct seller_id) as daily_active_sellers
    from {{ ref('fct_take_rate_analysis') }}
    group by 1, 2, 3, 4, 5
),

weekly_take_rates as (
    select
        tenant_id,
        order_year,
        order_month,
        -- Calculate week number
        case 
            when order_day_of_week = 0 then 1  -- Sunday
            when order_day_of_week = 1 then 2  -- Monday
            when order_day_of_week = 2 then 3  -- Tuesday
            when order_day_of_week = 3 then 4  -- Wednesday
            when order_day_of_week = 4 then 5  -- Thursday
            when order_day_of_week = 5 then 6  -- Friday
            when order_day_of_week = 6 then 7  -- Saturday
        end as week_number,
        avg(daily_avg_take_rate) as weekly_avg_take_rate,
        avg(daily_avg_effective_take_rate) as weekly_avg_effective_take_rate,
        sum(daily_gmv) as weekly_gmv,
        sum(daily_commission) as weekly_commission,
        avg(daily_active_sellers) as weekly_avg_active_sellers
    from daily_take_rates
    group by 1, 2, 3, 4
),

monthly_take_rates as (
    select
        tenant_id,
        order_year,
        order_month,
        avg(daily_avg_take_rate) as monthly_avg_take_rate,
        avg(daily_avg_effective_take_rate) as monthly_avg_effective_take_rate,
        sum(daily_gmv) as monthly_gmv,
        sum(daily_commission) as monthly_commission,
        avg(daily_active_sellers) as monthly_avg_active_sellers,
        
        -- Calculate take rate volatility (standard deviation)
        stddev(daily_avg_take_rate) as take_rate_volatility,
        
        -- Calculate take rate range
        max(daily_avg_take_rate) - min(daily_avg_take_rate) as take_rate_range
    from daily_take_rates
    group by 1, 2, 3
),

take_rate_trends as (
    select
        *,
        lag(monthly_avg_take_rate) over (partition by tenant_id order by order_year, order_month) as prev_month_take_rate,
        lag(monthly_avg_effective_take_rate) over (partition by tenant_id order by order_year, order_month) as prev_month_effective_take_rate
    from monthly_take_rates
),

trend_analysis as (
    select
        *,
        -- Calculate take rate trend
        case 
            when prev_month_take_rate > 0 then ((monthly_avg_take_rate - prev_month_take_rate) / prev_month_take_rate) * 100
            else null
        end as take_rate_trend,
        
        -- Calculate effective take rate trend
        case 
            when prev_month_effective_take_rate > 0 then ((monthly_avg_effective_take_rate - prev_month_effective_take_rate) / prev_month_effective_take_rate) * 100
            else null
        end as effective_take_rate_trend,
        
        -- Calculate take rate stability
        case 
            when take_rate_volatility < 1 then 'stable'
            when take_rate_volatility < 3 then 'moderate'
            else 'volatile'
        end as take_rate_stability
    from take_rate_trends
)

select
    tenant_id,
    order_year,
    order_month,
    monthly_avg_take_rate,
    monthly_avg_effective_take_rate,
    monthly_gmv,
    monthly_commission,
    monthly_avg_active_sellers,
    take_rate_volatility,
    take_rate_range,
    take_rate_trend,
    effective_take_rate_trend,
    take_rate_stability,
    current_timestamp as dbt_updated_at
from trend_analysis

