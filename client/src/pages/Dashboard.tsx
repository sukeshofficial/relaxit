import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authApi } from '../api/auth.api';
import { deviceApi } from '../api/device.api';
import { statisticsApi } from '../api/statistics.api';
import { postureApi } from '../api/posture.api';
import { sessionApi } from '../api/session.api';
import { alertApi } from '../api/alert.api';
import { eventApi } from '../api/event.api';
import type {
  AlertResponse,
  DeviceEventResponse,
  DeviceResponse,
  DeviceStatisticsResponse,
  PostureResponse,
  SessionResponse,
} from '../types/api';

import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { DeviceOnboarding } from '../components/dashboard/DeviceOnboarding';
import { StatisticsOverview } from '../components/dashboard/StatisticsOverview';
import { PostureSummary } from '../components/dashboard/PostureSummary';
import { RecentSessions } from '../components/dashboard/RecentSessions';
import { RecentAlerts } from '../components/dashboard/RecentAlerts';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import '../styles/devices.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore
    } finally {
      navigate('/login');
    }
  };

  // Primary Device State
  const [devices, setDevices] = useState<DeviceResponse[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<DeviceResponse | null>(null);
  const [isDevicesLoading, setIsDevicesLoading] = useState(true);
  const [devicesError, setDevicesError] = useState<string | null>(null);

  // Section States
  const [stats, setStats] = useState<DeviceStatisticsResponse | null>(null);
  const [isStatsLoading, setIsStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);

  const [postures, setPostures] = useState<PostureResponse[]>([]);
  const [isPostureLoading, setIsPostureLoading] = useState(false);
  const [postureError, setPostureError] = useState<string | null>(null);

  const [sessions, setSessions] = useState<SessionResponse[]>([]);
  const [isSessionsLoading, setIsSessionsLoading] = useState(false);
  const [sessionsError, setSessionsError] = useState<string | null>(null);

  const [alerts, setAlerts] = useState<AlertResponse[]>([]);
  const [isAlertsLoading, setIsAlertsLoading] = useState(false);
  const [alertsError, setAlertsError] = useState<string | null>(null);

  const [events, setEvents] = useState<DeviceEventResponse[]>([]);
  const [isEventsLoading, setIsEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState<string | null>(null);

  const [isRefreshingAll, setIsRefreshingAll] = useState(false);

  // 1. Fetch Devices List
  const fetchDevices = useCallback(async () => {
    setIsDevicesLoading(true);
    setDevicesError(null);
    try {
      const list: DeviceResponse[] = await deviceApi.getDevices();
      console.log('[Dashboard] devices list:', list.length, list);

      setDevices(list);

      if (list.length > 0) {
        setSelectedDevice((prev) => {
          if (prev) {
            const match = list.find((d) => d.id === prev.id);
            return match || list[0];
          }
          return list[0];
        });
      } else {
        setSelectedDevice(null);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load user devices.';
      setDevicesError(msg);
    } finally {
      setIsDevicesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  // Section Fetchers
  const fetchDeviceStatus = useCallback(async (deviceId: string) => {
    try {
      const res = await deviceApi.getDeviceStatus(deviceId);
      if (res.data) {
        setSelectedDevice((prev) =>
          prev && prev.id === deviceId
            ? { ...prev, status: res.data.status, lastSeenAt: res.data.lastSeenAt, firmwareVersion: res.data.firmwareVersion }
            : prev
        );
      }
    } catch {
      // Ignore background status fetch error
    }
  }, []);

  const fetchStatistics = useCallback(async (deviceId: string) => {
    setIsStatsLoading(true);
    setStatsError(null);
    try {
      const data = await statisticsApi.getDeviceStatistics(deviceId);
      setStats(data);
    } catch {
      setStatsError('Unable to load today\'s statistics.');
    } finally {
      setIsStatsLoading(false);
    }
  }, []);

  const fetchPosture = useCallback(async (deviceId: string) => {
    setIsPostureLoading(true);
    setPostureError(null);
    try {
      const list = await postureApi.getPostureHistoryList(deviceId);
      setPostures(list);
    } catch {
      setPostureError('Unable to load posture history.');
    } finally {
      setIsPostureLoading(false);
    }
  }, []);

  const fetchSessions = useCallback(async (deviceId: string) => {
    setIsSessionsLoading(true);
    setSessionsError(null);
    try {
      const page = await sessionApi.getSessions(deviceId, 0, 5);
      setSessions(page.content || []);
    } catch {
      setSessionsError('Unable to load sitting sessions.');
    } finally {
      setIsSessionsLoading(false);
    }
  }, []);

  const fetchAlerts = useCallback(async (deviceId: string) => {
    setIsAlertsLoading(true);
    setAlertsError(null);
    try {
      const page = await alertApi.getAlerts(deviceId, 0, 5);
      setAlerts(page.content || []);
    } catch {
      setAlertsError('Unable to load alerts.');
    } finally {
      setIsAlertsLoading(false);
    }
  }, []);

  const fetchEvents = useCallback(async (deviceId: string) => {
    setIsEventsLoading(true);
    setEventsError(null);
    try {
      const page = await eventApi.getEvents(deviceId, 0, 5);
      setEvents(page.content || []);
    } catch {
      setEventsError('Unable to load device events.');
    } finally {
      setIsEventsLoading(false);
    }
  }, []);

  // Fetch all data for selected device
  const fetchAllForDevice = useCallback(
    async (deviceId: string) => {
      setIsRefreshingAll(true);
      await Promise.allSettled([
        fetchDeviceStatus(deviceId),
        fetchStatistics(deviceId),
        fetchPosture(deviceId),
        fetchSessions(deviceId),
        fetchAlerts(deviceId),
        fetchEvents(deviceId),
      ]);
      setIsRefreshingAll(false);
    },
    [
      fetchDeviceStatus,
      fetchStatistics,
      fetchPosture,
      fetchSessions,
      fetchAlerts,
      fetchEvents,
    ]
  );

  useEffect(() => {
    if (selectedDevice?.id) {
      fetchAllForDevice(selectedDevice.id);
    }
  }, [selectedDevice?.id, fetchAllForDevice]);

  // Alert acknowledgement handler
  const handleAlertAcknowledged = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? { ...a, acknowledgedAt: new Date().toISOString() }
          : a
      )
    );
  };

  // Full Page Loading
  if (isDevicesLoading) {
    return (
      <div className="dashboard-page" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div className="skeleton-box" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
          <span style={{ fontSize: '0.875rem', color: '#8b949e' }}>Loading Relaxit Dashboard...</span>
        </div>
      </div>
    );
  }

  // Devices Fetch Error
  if (devicesError) {
    return (
      <div className="dashboard-page" style={{ alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div className="error-state" style={{ maxWidth: '440px' }}>
          <h2 className="error-state-title">Failed to Load Dashboard</h2>
          <p className="error-state-text">{devicesError}</p>
          <button onClick={fetchDevices} className="btn-secondary" style={{ marginTop: '12px' }}>
            Retry Loading Dashboard
          </button>
        </div>
      </div>
    );
  }

  console.log(user)
  // Zero devices state
  if (devices.length === 0 || !selectedDevice) {
    return (
      <div className="dashboard-page">
        <DashboardHeader
          userFirstName={user?.firstName || user?.fullName || user?.email}
          devices={[]}
          selectedDevice={null}
          onSelectDevice={() => { }}
          onRefresh={fetchDevices}
          isRefreshing={isDevicesLoading}
          onLogout={handleLogout}
        />
        <main className="dashboard-main">
          <DeviceOnboarding />
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <DashboardHeader
        userFirstName={user?.firstName || user?.fullName || user?.email}
        devices={devices}
        selectedDevice={selectedDevice}
        onSelectDevice={(device) => setSelectedDevice(device)}
        onRefresh={() => fetchAllForDevice(selectedDevice.id)}
        isRefreshing={isRefreshingAll}
        onLogout={handleLogout}
      />

      <main className="dashboard-main">
        {/* Today's Overview Statistics */}
        <StatisticsOverview
          statistics={stats}
          isLoading={isStatsLoading}
          error={statsError}
          onRetry={() => fetchStatistics(selectedDevice.id)}
        />

        {/* Multi-column Section: Posture & Recent Alerts */}
        <div className="dashboard-two-col">
          <PostureSummary
            postureList={postures}
            isLoading={isPostureLoading}
            error={postureError}
            onRetry={() => fetchPosture(selectedDevice.id)}
          />

          <RecentAlerts
            alerts={alerts}
            isLoading={isAlertsLoading}
            error={alertsError}
            onRetry={() => fetchAlerts(selectedDevice.id)}
            onAlertAcknowledged={handleAlertAcknowledged}
          />
        </div>

        {/* Multi-column Section: Recent Sessions & Device Activity */}
        <div className="dashboard-two-col">
          <RecentSessions
            sessions={sessions}
            isLoading={isSessionsLoading}
            error={sessionsError}
            onRetry={() => fetchSessions(selectedDevice.id)}
          />

          <RecentActivity
            events={events}
            isLoading={isEventsLoading}
            error={eventsError}
            onRetry={() => fetchEvents(selectedDevice.id)}
          />
        </div>
      </main>
    </div>
  );
}
