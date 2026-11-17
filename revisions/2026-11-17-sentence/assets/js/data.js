/* ============================================================================
   HIGH FIVE - Sample booking data (activities & venues domain, realistic)
   ========================================================================== */
(function () {
  const HF = (window.HF = window.HF || {});
  HF.data = {
    kpis: [
      { label: "Total Revenue", value: "SAR 284,190", delta: "+12.4%", up: true, spark: [18,22,20,28,26,34,32,40,44], icon: "revenue" },
      { label: "Reservations", value: "1,842", delta: "+8.1%", up: true, spark: [30,28,34,32,38,40,44,42,50], icon: "booking" },
      { label: "Occupancy Rate", value: "87.3%", delta: "+3.2%", up: true, spark: [60,64,62,70,72,78,80,84,87], icon: "hotel" },
      { label: "Cancellations", value: "3.1%", delta: "-1.4%", up: false, spark: [8,7,9,6,5,6,4,4,3], icon: "chart" },
    ],
    reservations: [
      { code: "HF-24815", guest: "Salem Al-Qahtani", email: "salem.q@gmail.com", activity: "Padel - Court A", venue: "SHQ Club, Riyadh", date: "Jul 9", time: "6:00 PM", dur: "90 min", amount: "SAR 180", status: "checkedin" },
      { code: "HF-24814", guest: "Marcus Chen", email: "m.chen@outlook.com", activity: "Bowling - Lane 4", venue: "Strike Zone", date: "Jul 9", time: "8:30 PM", dur: "60 min", amount: "SAR 120", status: "confirmed" },
      { code: "HF-24813", guest: "Nora Al-Rashid", email: "nora.r@icloud.com", activity: "Spa - Deep Relax", venue: "The Spa at Cross Gates", date: "Jul 10", time: "2:00 PM", dur: "60 min", amount: "SAR 350", status: "pending" },
      { code: "HF-24812", guest: "James Okonkwo", email: "j.okonkwo@gmail.com", activity: "Table Tennis - T2", venue: "Stable Hall", date: "Jul 8", time: "9:00 PM", dur: "60 min", amount: "SAR 60", status: "checkedout" },
      { code: "HF-24811", guest: "Layla Hassan", email: "layla.h@gmail.com", activity: "Football Academy U12", venue: "Development Academy", date: "Jul 11", time: "4:30 PM", dur: "120 min", amount: "SAR 250", status: "confirmed" },
      { code: "HF-24810", guest: "Liam O'Sullivan", email: "liam.os@proton.me", activity: "Padel - Court B", venue: "SHQ Club, Riyadh", date: "Jul 7", time: "7:30 PM", dur: "90 min", amount: "SAR 180", status: "cancelled" },
      { code: "HF-24809", guest: "Priya Nair", email: "priya.n@gmail.com", activity: "Yoga - Sunrise Flow", venue: "Calm Studio", date: "Jul 6", time: "6:30 AM", dur: "60 min", amount: "SAR 90", status: "completed" },
      { code: "HF-24808", guest: "Diego Fernández", email: "d.fernandez@gmail.com", activity: "Bowling - Lane 2", venue: "Strike Zone", date: "Jul 12", time: "5:00 PM", dur: "60 min", amount: "SAR 120", status: "refunded" },
    ],
    activity: [
      { who: "Salem Al-Qahtani", action: "checked in · Padel Court A", time: "2 min ago", type: "checkedin" },
      { who: "Marcus Chen", action: "confirmed booking HF-24814", time: "18 min ago", type: "confirmed" },
      { who: "Payment received", action: "SAR 120 from Marcus Chen", time: "22 min ago", type: "payment" },
      { who: "Nora Al-Rashid", action: "rescheduled Spa session to 3:00 PM", time: "1 hr ago", type: "pending" },
      { who: "Liam O'Sullivan", action: "cancelled booking HF-24810", time: "2 hr ago", type: "cancelled" },
    ],
    payments: [
      { guest: "Marcus Chen", method: "Visa ·· 4821", amount: "SAR 120", status: "success" },
      { guest: "Priya Nair", method: "Apple Pay", amount: "SAR 90", status: "success" },
      { guest: "Diego Fernández", method: "Refund · Mada", amount: "-SAR 120", status: "refund" },
      { guest: "Layla Hassan", method: "Mada ·· 1190", amount: "SAR 250", status: "pending" },
    ],
    revenueSeries: [42,48,45,52,60,58,66,72,68,80,86,92],
    revenueMonths: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    channelMix: [
      { label: "App", value: 44, color: "var(--chart-1)" },
      { label: "Website", value: 26, color: "var(--chart-2)" },
      { label: "Walk-in", value: 14, color: "var(--chart-3)" },
      { label: "Partners", value: 10, color: "var(--chart-4)" },
      { label: "Corporate", value: 6, color: "var(--chart-5)" },
    ],
  };
})();
