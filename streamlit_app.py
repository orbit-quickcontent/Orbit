import os
import json
import sqlite3
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import streamlit as st
import plotly.express as px
import plotly.graph_objects as go

# Set page configuration
st.set_page_config(
    page_title="ORBIT - Platform Analytics & Operations",
    page_icon="🚀",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for Premium Glassmorphic Theme matching ORBIT Branding (Cyan/Purple/Dark)
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap');
    
    /* Global Background and Typography */
    .stApp {
        background: radial-gradient(circle at 80% 20%, #17122a, #0b0714, #05040a) !important;
        color: #f5f4fc !important;
        font-family: 'Inter', sans-serif !important;
    }
    
    /* Headers Styling */
    h1, h2, h3, h4, h5, h6 {
        font-family: 'Outfit', sans-serif !important;
        color: #ffffff !important;
        font-weight: 700 !important;
    }
    
    /* Sidebar styling */
    section[data-testid="stSidebar"] {
        background-color: rgba(8, 6, 15, 0.8) !important;
        border-right: 1px solid rgba(255, 255, 255, 0.05) !important;
    }
    
    section[data-testid="stSidebar"] h1, section[data-testid="stSidebar"] h2, section[data-testid="stSidebar"] h3 {
        color: #ffffff !important;
    }
    
    /* Premium Glassmorphic Cards */
    .glass-card {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 16px;
        padding: 24px;
        box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        margin-bottom: 20px;
    }
    
    /* Custom Stats Metric Container */
    .stat-container {
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 16px;
        padding: 20px;
        box-shadow: 0 8px 24px 0 rgba(0, 0, 0, 0.4);
        margin-bottom: 16px;
        backdrop-filter: blur(10px);
        border-left: 4px solid #00F0FF; /* Default ORBIT Cyan indicator */
    }
    
    .stat-container.cyan { border-left-color: #00F0FF; }
    .stat-container.purple { border-left-color: #9d4edd; }
    .stat-container.green { border-left-color: #00d2d3; }
    .stat-container.yellow { border-left-color: #ff9f43; }
    
    .stat-title {
        font-size: 11px;
        color: #958eb6;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        font-weight: 600;
        margin-bottom: 4px;
    }
    
    .stat-value {
        font-size: 26px;
        font-weight: 700;
        color: #ffffff;
        font-family: 'Outfit', sans-serif;
    }
    
    .stat-delta {
        font-size: 11px;
        margin-top: 6px;
        font-weight: 500;
        color: #00F0FF;
    }
    
    .demo-banner {
        background: linear-gradient(90deg, rgba(0, 240, 255, 0.1), rgba(157, 78, 221, 0.1));
        border: 1px solid rgba(0, 240, 255, 0.2);
        border-radius: 12px;
        padding: 12px 20px;
        margin-bottom: 24px;
        font-size: 13px;
        color: #00F0FF;
    }
</style>
""", unsafe_allow_html=True)

CHART_COLORS = ['#00F0FF', '#9d4edd', '#00d2d3', '#ff9f43', '#ff7675', '#fd79a8', '#fdcb6e', '#00cec9', '#a55eea', '#26de81']

# Custom Plotly helper
def customize_plotly_chart(fig):
    fig.update_layout(
        paper_bgcolor='rgba(0,0,0,0)',
        plot_bgcolor='rgba(0,0,0,0)',
        font=dict(family="Inter, sans-serif", color="#958eb6", size=11),
        title=dict(font=dict(family="Outfit, sans-serif", size=16, color="#ffffff")),
        margin=dict(l=40, r=40, t=50, b=40),
        xaxis=dict(
            showgrid=True,
            gridcolor='rgba(255,255,255,0.03)',
            linecolor='rgba(255,255,255,0.06)',
            tickfont=dict(color="#958eb6")
        ),
        yaxis=dict(
            showgrid=True,
            gridcolor='rgba(255,255,255,0.03)',
            linecolor='rgba(255,255,255,0.06)',
            tickfont=dict(color="#958eb6")
        ),
        legend=dict(
            font=dict(color="#958eb6"),
            bgcolor='rgba(0,0,0,0)'
        )
    )
    return fig

# Resolve SQLite path
def get_db_connection():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    db_path = os.path.join(base_dir, 'dashboard-web-app', 'db', 'client.db')
    if not os.path.exists(db_path):
        # Fallback search
        db_path = os.path.join(base_dir, 'db', 'client.db')
    return sqlite3.connect(db_path) if os.path.exists(db_path) else None

# Load raw SQLite tables into dataframes
@st.cache_data(ttl=60)
def load_db_data():
    conn = get_db_connection()
    if conn is None:
        return None, None, None, None, None
    try:
        users = pd.read_sql_query("SELECT * FROM User", conn)
        packages = pd.read_sql_query("SELECT * FROM Package", conn)
        partners = pd.read_sql_query("SELECT * FROM Partner", conn)
        bookings = pd.read_sql_query("SELECT * FROM Booking", conn)
        audit_logs = pd.read_sql_query("SELECT * FROM AuditLog", conn)
        conn.close()
        return users, packages, partners, bookings, audit_logs
    except Exception:
        return None, None, None, None, None

# Load SQLite Data
sqlite_users, sqlite_packages, sqlite_partners, sqlite_bookings, sqlite_logs = load_db_data()

# Check if database has bookings/users, if not set Demo Data to true
db_is_empty = sqlite_bookings is None or len(sqlite_bookings) == 0

# Sidebar header / branding
st.sidebar.markdown("""
<div style='display: flex; align-items: center; gap: 12px; margin-bottom: 24px;'>
    <div style='background: linear-gradient(135deg, #00F0FF, #9d4edd); width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 15px rgba(0, 240, 255, 0.4);'>
        <span style='color: black; font-weight: 800; font-size: 20px;'>O</span>
    </div>
    <div style='line-height: 1.1;'>
        <h3 style='margin: 0; font-size: 20px; font-weight: 700;'>ORBIT</h3>
        <span style='color: #958eb6; font-size: 11px;'>Operations Control (v1.0.8)</span>
    </div>
</div>
""", unsafe_allow_html=True)

# Toggle for Demo Data simulation
st.sidebar.subheader("Dashboard Mode")
use_demo = st.sidebar.toggle(
    "Simulate Operational Data", 
    value=db_is_empty,
    help="Fills dashboard charts with realistic simulated orders and performance data if your local SQLite database is currently empty."
)

st.sidebar.markdown("---")
st.sidebar.subheader("Operations Menu")
menu_selection = st.sidebar.radio(
    label="Menu Select",
    options=[
        "Platform Overview",
        "Client Bookings",
        "Partner Network",
        "Admin Audit Logs"
    ],
    index=0,
    label_visibility="collapsed"
)

# Generate Demo/Simulated Data if needed
def get_simulated_data():
    np.random.seed(42)
    now = datetime.now()
    
    # 1. Packages
    pkgs = [
        {"id": "pkg-personalized", "name": "Personalized Reel", "price": 1999, "focus": "Events / Individual shoots"},
        {"id": "pkg-professional", "name": "Professional UGC Pack", "price": 4999, "focus": "Brand Ads / Creators"}
    ]
    df_pkgs = pd.DataFrame(pkgs)
    
    # 2. Users
    user_names = ["Ananya Sharma", "Rahul Verma", "Karan Malhotra", "Sneha Rao", "Pooja Patel", "Amit Singh", "Vijay Iyer"]
    users_data = []
    for i, name in enumerate(user_names):
        users_data.append({
            "id": f"usr-{i}",
            "email": f"{name.lower().replace(' ', '')}@gmail.com",
            "name": name,
            "phone": f"+91 98765 {43210 + i}",
            "location": "Mumbai, India",
            "role": "USER"
        })
    df_users = pd.DataFrame(users_data)
    
    # 3. Partners
    partner_names = ["Rohan Roy", "Vikram Rathore", "Divya Pillai", "Arjun Kapoor"]
    partners_data = []
    # Mock coordinates in Mumbai
    lats = [19.0760, 19.1278, 19.0330, 19.2183]
    lngs = [72.8777, 72.8258, 72.8550, 72.9781]
    
    for i, name in enumerate(partner_names):
        partners_data.append({
            "id": f"ptn-{i}",
            "name": name,
            "location": "Mumbai, India",
            "latitude": lats[i],
            "longitude": lngs[i],
            "availability": True if i < 3 else False,
            "isVerified": True if i < 3 else False,
            "rating": 4.5 + (i * 0.15),
            "completedProjects": 12 + (i * 5),
            "walletBalance": 15000.0 + (i * 3500.0),
            "deviceInfo": "iPhone 15 Pro" if i%2==0 else "Sony FX30"
        })
    df_partners = pd.DataFrame(partners_data)
    
    # 4. Bookings
    statuses = ["PENDING", "PAID", "EN_ROUTE", "SHOOTING", "SYNCING", "EDITING", "DELIVERED", "CANCELLED"]
    status_probs = [0.05, 0.10, 0.05, 0.05, 0.05, 0.10, 0.55, 0.05]
    
    bookings_data = []
    for i in range(120):
        # random date in last 30 days
        days_ago = np.random.randint(0, 30)
        b_date = now - timedelta(days=days_ago)
        
        status = np.random.choice(statuses, p=status_probs)
        pkg = np.random.choice(pkgs)
        usr = np.random.choice(users_data)
        ptn = np.random.choice(partners_data) if status != "PENDING" else None
        
        bookings_data.append({
            "id": f"orb-{1000 + i}",
            "userId": usr["id"],
            "userName": usr["name"],
            "packageId": pkg["id"],
            "packageName": pkg["name"],
            "packagePrice": pkg["price"],
            "partnerId": ptn["id"] if ptn else None,
            "partnerName": ptn["name"] if ptn else "Unassigned",
            "status": status,
            "paymentStatus": "SUCCESS" if status != "PENDING" else "UNPAID",
            "bookingDate": b_date.strftime("%Y-%m-%d"),
            "timeSlot": "12:00 PM",
            "location": "Bandra, Mumbai",
            "syncPercentage": 100 if status == "DELIVERED" else (np.random.randint(20, 95) if status == "SYNCING" else 0),
            "deliveredAt": (b_date + timedelta(hours=3)).strftime("%Y-%m-%d %H:%M") if status == "DELIVERED" else None
        })
    df_bookings = pd.DataFrame(bookings_data)
    
    # 5. Audit Logs
    actions = ["USER_LOGIN", "CREATE_BOOKING", "UPDATE_WALLET", "PARTNER_DISPATCHED", "SYNC_COMPLETE", "REEL_DELIVERED"]
    logs_data = []
    for i in range(50):
        days_ago = np.random.randint(0, 5)
        log_date = now - timedelta(days=days_ago)
        usr = np.random.choice(users_data)
        action = np.random.choice(actions)
        
        logs_data.append({
            "id": f"log-{200 + i}",
            "userId": usr["id"],
            "userName": usr["name"],
            "action": action,
            "entity": "Booking" if "BOOKING" in action or "REEL" in action else "User",
            "createdAt": log_date.strftime("%Y-%m-%d %H:%M:%S")
        })
    df_logs = pd.DataFrame(logs_data)
    
    return df_users, df_pkgs, df_partners, df_bookings, df_logs

# Apply Datasets based on toggle
if use_demo:
    df_users, df_pkgs, df_partners, df_bookings, df_logs = get_simulated_data()
else:
    # Use real SQLite data (if populated)
    if sqlite_bookings is not None:
        df_users = sqlite_users
        df_pkgs = sqlite_packages
        df_partners = sqlite_partners
        df_bookings = sqlite_bookings
        df_logs = sqlite_logs
        
        # Format names inside dataframe from DB links
        df_bookings = df_bookings.merge(df_users[['id', 'name']], left_on='userId', right_on='id', suffixes=('', '_user'))
        df_bookings.rename(columns={'name': 'userName'}, inplace=True)
        df_bookings = df_bookings.merge(df_pkgs[['id', 'name', 'price']], left_on='packageId', right_on='id', suffixes=('', '_pkg'))
        df_bookings.rename(columns={'name': 'packageName', 'price': 'packagePrice'}, inplace=True)
        
        if 'partnerId' in df_bookings.columns:
            # merge partner name
            df_partners_joined = df_partners.merge(df_users[['id', 'name']], left_on='userId', right_on='id')
            df_bookings = df_bookings.merge(df_partners_joined[['id', 'name']], left_on='partnerId', right_on='id', how='left')
            df_bookings.rename(columns={'name': 'partnerName'}, inplace=True)
            df_bookings['partnerName'] = df_bookings['partnerName'].fillna('Unassigned')
        else:
            df_bookings['partnerName'] = 'Unassigned'
            df_bookings['partnerId'] = None
    else:
        st.warning("Could not connect to database. Defaulting to Simulated Demo Data.")
        df_users, df_pkgs, df_partners, df_bookings, df_logs = get_simulated_data()

# Check layout totals
total_bookings = len(df_bookings)
delivered_bookings = len(df_bookings[df_bookings['status'] == "DELIVERED"])
active_bookings = len(df_bookings[~df_bookings['status'].isin(["DELIVERED", "CANCELLED", "PENDING"])])
total_revenue = df_bookings[df_bookings['status'] != "PENDING"]['packagePrice'].sum()

# Display banner if using Demo Data
if use_demo:
    st.markdown("""
    <div class="demo-banner">
        ⚡ <strong>Simulation Mode Active:</strong> Displaying generated real-time platform data for preview purposes. Turn off in the sidebar to view raw SQLite data.
    </div>
    """, unsafe_allow_html=True)

# ==========================================
# 📊 PLATFORM OVERVIEW VIEW
# ==========================================
if menu_selection == "Platform Overview":
    st.markdown("## Platform Operations Overview")
    st.markdown("<p style='color:#958eb6; margin-top:-15px; margin-bottom: 25px;'>Key fiscal statistics, delivery KPIs, and active pipeline monitoring</p>", unsafe_allow_html=True)
    
    # KPI Grid
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.markdown(f"""
        <div class="stat-container cyan">
            <div class="stat-title">Platform Revenue (Gross)</div>
            <div class="stat-value">₹{total_revenue:,.2f}</div>
            <div class="stat-delta">Paid & Delivered Bookings</div>
        </div>
        """, unsafe_allow_html=True)
    with col2:
        st.markdown(f"""
        <div class="stat-container purple">
            <div class="stat-title">Total Orders Placed</div>
            <div class="stat-value">{total_bookings}</div>
            <div class="stat-delta">{delivered_bookings} Delivered successfully</div>
        </div>
        """, unsafe_allow_html=True)
    with col3:
        st.markdown(f"""
        <div class="stat-container green">
            <div class="stat-title">Active Shoots / Edits</div>
            <div class="stat-value">{active_bookings}</div>
            <div class="stat-delta">Currently in the delivery pipeline</div>
        </div>
        """, unsafe_allow_html=True)
    with col4:
        # Verified Partners count
        verified_partners = len(df_partners[df_partners['isVerified'] == True]) if 'isVerified' in df_partners.columns else len(df_partners)
        st.markdown(f"""
        <div class="stat-container yellow">
            <div class="stat-title">Active Partner Pool</div>
            <div class="stat-value">{len(df_partners)}</div>
            <div class="stat-delta">{verified_partners} KYC Verified videographers</div>
        </div>
        """, unsafe_allow_html=True)
        
    st.markdown("<br>", unsafe_allow_html=True)
    left_col, right_col = st.columns([3, 2])
    
    with left_col:
        st.markdown("<div class='glass-card'>", unsafe_allow_html=True)
        # Daily Booking Volumes Line Chart
        df_bookings['Date'] = pd.to_datetime(df_bookings['bookingDate'])
        df_daily = df_bookings.groupby('Date').size().reset_index(name='Volume')
        df_daily = df_daily.sort_values('Date')
        
        fig_trend = px.line(
            df_daily, x='Date', y='Volume', markers=True,
            title="Daily Booking Volume Trend (30 Days)",
            labels={'Volume': 'Shoots Booked', 'Date': 'Date'}
        )
        fig_trend.update_traces(line_color='#00F0FF', line_width=3, fill='tozeroy', fillcolor='rgba(0, 240, 255, 0.04)')
        st.plotly_chart(customize_plotly_chart(fig_trend), use_container_width=True)
        st.markdown("</div>", unsafe_allow_html=True)
        
    with right_col:
        st.markdown("<div class='glass-card'>", unsafe_allow_html=True)
        # Booking Status share Pie chart
        df_status = df_bookings.groupby('status').size().reset_index(name='Count')
        fig_pie = px.pie(
            df_status, values='Count', names='status',
            title="Reel Delivery Status Distribution",
            hole=0.45,
            color_discrete_sequence=CHART_COLORS
        )
        st.plotly_chart(customize_plotly_chart(fig_pie), use_container_width=True)
        st.markdown("</div>", unsafe_allow_html=True)

# ==========================================
# 🏛️ CLIENT BOOKINGS VIEW
# ==========================================
elif menu_selection == "Client Bookings":
    st.markdown("## Client Shoot Bookings")
    st.markdown("<p style='color:#958eb6; margin-top:-15px; margin-bottom: 25px;'>Monitor live statuses, sync progress, and edit delivery timelines</p>", unsafe_allow_html=True)
    
    # Filter controls
    f_col1, f_col2 = st.columns(2)
    with f_col1:
        status_filter = st.multiselect(
            "Filter by Delivery Status",
            options=df_bookings['status'].unique().tolist(),
            default=df_bookings['status'].unique().tolist()
        )
    with f_col2:
        pkg_filter = st.multiselect(
            "Filter by Package Type",
            options=df_bookings['packageName'].unique().tolist(),
            default=df_bookings['packageName'].unique().tolist()
        )
        
    df_filtered = df_bookings[
        df_bookings['status'].isin(status_filter) &
        df_bookings['packageName'].isin(pkg_filter)
    ]
    
    st.markdown(f"<p style='color:#00F0FF; font-weight:600; font-size:13px;'>Showing {len(df_filtered)} bookings</p>", unsafe_allow_html=True)
    
    st.markdown("<div class='glass-card'>", unsafe_allow_html=True)
    # Booking Table
    df_display = df_filtered[[
        'id', 'userName', 'packageName', 'packagePrice', 
        'partnerName', 'status', 'bookingDate', 'syncPercentage'
    ]].copy()
    
    df_display.rename(columns={
        'id': 'Order ID',
        'userName': 'Client Name',
        'packageName': 'Package',
        'packagePrice': 'Outlay (INR)',
        'partnerName': 'Assigned Partner',
        'status': 'Status',
        'bookingDate': 'Date',
        'syncPercentage': 'Upload Sync %'
    }, inplace=True)
    
    st.dataframe(df_display, hide_index=True, use_container_width=True)
    
    # Export CSV
    csv = df_display.to_csv(index=False).encode('utf-8')
    st.download_button(
        label="📥 Export Booking Grid as CSV",
        data=csv,
        file_name="orbit_bookings_report.csv",
        mime="text/csv"
    )
    st.markdown("</div>", unsafe_allow_html=True)

# ==========================================
# 🎥 PARTNER NETWORK VIEW
# ==========================================
elif menu_selection == "Partner Network":
    st.markdown("## Partner Videographer Pool")
    st.markdown("<p style='color:#958eb6; margin-top:-15px; margin-bottom: 25px;'>Track partner availability, ratings, and physical distribution</p>", unsafe_allow_html=True)
    
    # Partner Stats Cards
    col1, col2, col3 = st.columns(3)
    with col1:
        st.markdown(f"""
        <div class="stat-container cyan">
            <div class="stat-title">Average Partner Rating</div>
            <div class="stat-value">⭐ {df_partners['rating'].mean().round(2)} / 5.0</div>
            <div class="stat-delta">Based on client feedback metrics</div>
        </div>
        """, unsafe_allow_html=True)
    with col2:
        # Availability
        online_partners = len(df_partners[df_partners['availability'] == True])
        st.markdown(f"""
        <div class="stat-container purple">
            <div class="stat-title">Active / Online Partners</div>
            <div class="stat-value">{online_partners} / {len(df_partners)}</div>
            <div class="stat-delta">Ready to receive instant dispatches</div>
        </div>
        """, unsafe_allow_html=True)
    with col3:
        st.markdown(f"""
        <div class="stat-container green">
            <div class="stat-title">Completed Partner Projects</div>
            <div class="stat-value">{df_partners['completedProjects'].sum()} shoots</div>
            <div class="stat-delta">Delivered cinematic reels</div>
        </div>
        """, unsafe_allow_html=True)
        
    left_col, right_col = st.columns([3, 2])
    
    with left_col:
        st.markdown("<div class='glass-card'>", unsafe_allow_html=True)
        st.markdown("<h4>Videographer Geolocation Map</h4>", unsafe_allow_html=True)
        st.markdown("<span style='color:#958eb6; font-size:11px;'>Real-time physical tracking of active partner locations in Mumbai</span><br/><br/>", unsafe_allow_html=True)
        
        # Plot map using partner lat/lng
        df_map = df_partners[['latitude', 'longitude']].dropna()
        if len(df_map) > 0:
            st.map(df_map)
        else:
            st.info("No GPS coordinates recorded for online partners.")
        st.markdown("</div>", unsafe_allow_html=True)
        
    with right_col:
        st.markdown("<div class='glass-card'>", unsafe_allow_html=True)
        st.markdown("<h4>Performance Grid</h4>", unsafe_allow_html=True)
        st.markdown("<br>", unsafe_allow_html=True)
        
        df_p_view = df_partners[['name', 'rating', 'completedProjects', 'walletBalance', 'deviceInfo']].copy()
        df_p_view.rename(columns={
            'name': 'Partner Name',
            'rating': 'Rating',
            'completedProjects': 'Projects',
            'walletBalance': 'Wallet (INR)',
            'deviceInfo': 'Camera Device'
        }, inplace=True)
        st.dataframe(df_p_view, hide_index=True, use_container_width=True)
        st.markdown("</div>", unsafe_allow_html=True)

# ==========================================
# ⚙️ ADMIN AUDIT LOGS VIEW
# ==========================================
elif menu_selection == "Admin Audit Logs":
    st.markdown("## Platform Audit Trail")
    st.markdown("<p style='color:#958eb6; margin-top:-15px; margin-bottom: 25px;'>Real-time tracking of platform state shifts and user actions</p>", unsafe_allow_html=True)
    
    # Audit search bar
    log_search = st.text_input("🔍 Filter audit trail by client name or action type (e.g. USER_LOGIN)")
    
    df_l_view = df_logs.copy()
    if log_search:
        df_l_view = df_l_view[
            df_l_view['userName'].str.contains(log_search, case=False, na=False) |
            df_l_view['action'].str.contains(log_search, case=False, na=False)
        ]
        
    st.markdown("<div class='glass-card'>", unsafe_allow_html=True)
    df_l_display = df_l_view[['id', 'userName', 'action', 'entity', 'createdAt']].copy()
    df_l_display.rename(columns={
        'id': 'Log ID',
        'userName': 'Triggered By',
        'action': 'Action Type',
        'entity': 'Target Entity',
        'createdAt': 'Timestamp'
    }, inplace=True)
    
    st.dataframe(df_l_display, hide_index=True, use_container_width=True)
    st.markdown("</div>", unsafe_allow_html=True)
