from django.shortcuts import render

# Create your views here.
from django.core.paginator import Paginator
from django.db.models import Avg, Count, Max, Min
from django.http import JsonResponse
from django.utils.dateparse import parse_datetime

from telemetry.models import Reading

MAX_PAGE_SIZE = 200


def apply_filters(queryset, params):
    asset_id = params.get("asset_id")
    if asset_id:
        queryset = queryset.filter(asset_id=asset_id)

    asset_type = params.get("asset_type")
    if asset_type:
        queryset = queryset.filter(asset_type=asset_type)

    metric = params.get("metric")
    if metric:
        queryset = queryset.filter(metric=metric)

    status = params.get("status")
    if status:
        queryset = queryset.filter(status=status)

    time_from = parse_datetime(params.get("time_from", ""))
    if time_from:
        queryset = queryset.filter(recorded_at__gte=time_from)

    time_to = parse_datetime(params.get("time_to", ""))
    if time_to:
        queryset = queryset.filter(recorded_at__lte=time_to)

    return queryset


def reading_list(request):
    queryset = apply_filters(Reading.objects.all(), request.GET)

    try:
        page_number = max(1, int(request.GET.get("page", 1)))
        page_size = int(request.GET.get("page_size", 50))
    except ValueError:
        return JsonResponse({"error": "page and page_size must be integers"}, status=400)

    page_size = min(max(1, page_size), MAX_PAGE_SIZE)

    paginator = Paginator(queryset, page_size)
    page = paginator.get_page(page_number)

    return JsonResponse({
        "results": [
            {
                "id": r.id,
                "asset_id": r.asset_id,
                "asset_type": r.asset_type,
                "metric": r.metric,
                "value": r.value,
                "unit": r.unit,
                "recorded_at": r.recorded_at.isoformat(),
                "status": r.status,
                "is_out_of_range": r.is_out_of_range,
            }
            for r in page
        ],
        "page": page.number,
        "page_size": page_size,
        "total_pages": paginator.num_pages,
        "total_count": paginator.count,
    })


def reading_summary(request):
    queryset = apply_filters(Reading.objects.all(), request.GET)
    
    stats = (
        queryset
        .exclude(value__isnull=True)
        .values("asset_id", "metric", "unit")
        .annotate(
            avg=Avg("value"),
            min=Min("value"),
            max=Max("value"),
            count=Count("id"),
        )
        .order_by("asset_id", "metric")
    )
    metrics = sorted({row["metric"] for row in stats})

    return JsonResponse({"results": list(stats), "metrics": metrics})


def asset_list(request):
    assets = (
        Reading.objects
        .values("asset_id", "asset_type")
        .distinct()
        .order_by("asset_id")
    )
    
    return JsonResponse({"results": list(assets)})