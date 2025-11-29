/* eslint-disable react/prop-types */
"use client"

import Chart from "react-apexcharts"

export default function EventCharts({ data, analytics }) {
  const eventTypeData = analytics?.eventsByType
    ? Object.entries(analytics.eventsByType).map(([name, value]) => ({ name, value }))
    : []

  const pageData = analytics?.eventsByPage
    ? Object.entries(analytics.eventsByPage)
        .map(([name, value]) => ({ name: name.substring(0, 30), fullName: name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 8)
    : []

  const buttonData = analytics?.eventsByButton
    ? Object.entries(analytics.eventsByButton)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 6)
    : []

  // Timeline Data (events over time)
  const timelineData = data
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .map((event, index) => ({
      time: new Date(event.timestamp).toLocaleTimeString(),
      count: index + 1,
      timestamp: event.timestamp,
    }))

  // IP Address Distribution
  const ipData = Object.entries(
    data.reduce((acc, event) => {
      acc[event.ipAddress] = (acc[event.ipAddress] || 0) + 1
      return acc
    }, {}),
  )
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)

  const eventTypeChartOptions = {
    chart: { type: "pie" },
    labels: eventTypeData.map((d) => d.name),
    colors: ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"],
    responsive: [{ breakpoint: 480, options: { chart: { width: 300 }, legend: { position: "bottom" } } }],
  }

  const pageChartOptions = {
    chart: { type: "bar", toolbar: { show: false } },
    plotOptions: { bar: { horizontal: false, columnWidth: "55%" } },
    dataLabels: { enabled: false },
    xaxis: { categories: pageData.map((d) => d.name) },
    colors: ["#3b82f6"],
    tooltip: {
      custom: ({ series, seriesIndex, dataPointIndex, w }) =>
        '<div class="bg-background border border-border rounded p-2 text-sm">' +
        "<p class='font-semibold'>" +
        pageData[dataPointIndex].fullName +
        "</p>" +
        "<p>Events: " +
        series[seriesIndex][dataPointIndex] +
        "</p>" +
        "</div>",
    },
  }

  const buttonChartOptions = {
    chart: { type: "bar", toolbar: { show: false } },
    plotOptions: { bar: { horizontal: true, columnWidth: "55%" } },
    dataLabels: { enabled: false },
    xaxis: { categories: buttonData.map((d) => d.name) },
    colors: ["#ef4444"],
  }

  const timelineChartOptions = {
    chart: { type: "line", toolbar: { show: false } },
    stroke: { curve: "smooth", width: 2 },
    xaxis: { categories: timelineData.map((d) => d.time) },
    colors: ["#10b981"],
    dataLabels: { enabled: false },
    tooltip: { theme: "light" },
  }

  const ipChartOptions = {
    chart: { type: "bar", toolbar: { show: false } },
    plotOptions: { bar: { horizontal: false, columnWidth: "55%" } },
    dataLabels: { enabled: false },
    xaxis: { categories: ipData.map((d) => d.name) },
    colors: ["#f59e0b"],
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Event Type Distribution */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-2">Event Type Distribution</h3>
        <p className="text-sm text-muted-foreground mb-4">Breakdown of events by type</p>
        <Chart options={eventTypeChartOptions} series={eventTypeData.map((d) => d.value)} type="pie" height={300} />
      </div>

      {/* Page Distribution */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-2">Top Pages</h3>
        <p className="text-sm text-muted-foreground mb-4">Most visited pages</p>
        <Chart
          options={pageChartOptions}
          series={[{ name: "Events", data: pageData.map((d) => d.value) }]}
          type="bar"
          height={300}
        />
      </div>

      {/* Button Name Distribution */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-2">Top Buttons Clicked</h3>
        <p className="text-sm text-muted-foreground mb-4">Most interacted buttons</p>
        <Chart
          options={buttonChartOptions}
          series={[{ name: "Clicks", data: buttonData.map((d) => d.value) }]}
          type="bar"
          height={300}
        />
      </div>

      {/* Timeline */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-2">Event Timeline</h3>
        <p className="text-sm text-muted-foreground mb-4">Cumulative events over time</p>
        <Chart
          options={timelineChartOptions}
          series={[{ name: "Cumulative Events", data: timelineData.map((d) => d.count) }]}
          type="line"
          height={300}
        />
      </div>

      {/* IP Address Distribution */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-2">Top IP Addresses</h3>
        <p className="text-sm text-muted-foreground mb-4">Most active visitors</p>
        <Chart
          options={ipChartOptions}
          series={[{ name: "Events", data: ipData.map((d) => d.value) }]}
          type="bar"
          height={300}
        />
      </div>

      {/* Summary Stats */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-4">Summary Statistics</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-border">
            <span className="text-muted-foreground">Total Events</span>
            <span className="font-semibold text-lg text-foreground">{analytics?.totalEvents || 0}</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-border">
            <span className="text-muted-foreground">Unique Event Types</span>
            <span className="font-semibold text-lg text-foreground">{eventTypeData.length}</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-border">
            <span className="text-muted-foreground">Unique Pages</span>
            <span className="font-semibold text-lg text-foreground">
              {analytics?.eventsByPage ? Object.keys(analytics.eventsByPage).length : 0}
            </span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-border">
            <span className="text-muted-foreground">Unique Users</span>
            <span className="font-semibold text-lg text-foreground">{analytics?.uniqueUsers || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Unique Sessions</span>
            <span className="font-semibold text-lg text-foreground">{analytics?.uniqueSessions || 0}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
