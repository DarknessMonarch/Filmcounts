"use client";

import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/app/store/Auth";
import { useTrailStore } from "@/app/store/Trail";
import FormDropdown from "@/app/components/FormDropdown";
import styles from "@/app/styles/configuration.module.css";
import { 
  MdVisibility, 
  MdVisibilityOff, 
  MdEmail, 
  MdSchedule, 
  MdNotifications, 
  MdSecurity, 
  MdStorage, 
  MdPeople,
  MdSearch,
  MdFilterList,
  MdRefresh,
  MdAccountCircle,
  MdAccessTime,
  MdInfo
} from "react-icons/md";

export default function UserManagement() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, tokens } = useAuthStore();
  const { trails, loading, searchTrail } = useTrailStore();

  const currentNavSection = searchParams.get('navSection') || 'API Keys';

  // Configuration states (keeping existing ones)
  const [apiConfig, setApiConfig] = useState({
    provider: 'Minio',
    apiKey: '',
    apiSecret: ''
  });

  const [emailConfig, setEmailConfig] = useState({
    smtpServer: '',
    smtpPort: '587',
    emailAddress: '',
    password: '',
    encryptionType: 'TLS',
    senderName: 'Organization Support',
    replyToEmail: '',
    maxEmailsPerHour: '100'
  });

  const [scheduleConfig, setScheduleConfig] = useState({
    backupFrequency: { label: 'Daily', value: 'daily' },
    backupTime: '02:00',
    cleanupFrequency: { label: 'Weekly', value: 'weekly' },
    cleanupDay: { label: 'Sunday', value: 'sunday' },
    reportFrequency: { label: 'Monthly', value: 'monthly' },
    reportRecipients: '',
    maintenanceWindow: '03:00-05:00',
    autoUpdates: true
  });

  // Trail search states
  const [searchFilters, setSearchFilters] = useState({
    action: '',
    resource: '',
    userId: '',
    startDate: '',
    endDate: '',
    ipAddress: '',
          limit: '50',
    sortBy: 'timestamp',
    sortOrder: 'desc'
  });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Visibility states
  const [showApiKey, setShowApiKey] = useState(false);
  const [showApiSecret, setShowApiSecret] = useState(false);
  const [showEmailPassword, setShowEmailPassword] = useState(false);

  // Dropdown options (keeping existing ones)
  const providerOptions = [
    { label: 'Minio', value: 'minio' },
    { label: 'AWS S3', value: 'aws' },
    { label: 'Google Cloud Storage', value: 'gcs' },
    { label: 'Azure Blob Storage', value: 'azure' }
  ];

  const encryptionOptions = [
    { label: 'TLS', value: 'tls' },
    { label: 'SSL', value: 'ssl' },
    { label: 'None', value: 'none' }
  ];

  const frequencyOptions = [
    { label: 'Hourly', value: 'hourly' },
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' }
  ];

  const dayOptions = [
    { label: 'Monday', value: 'monday' },
    { label: 'Tuesday', value: 'tuesday' },
    { label: 'Wednesday', value: 'wednesday' },
    { label: 'Thursday', value: 'thursday' },
    { label: 'Friday', value: 'friday' },
    { label: 'Saturday', value: 'saturday' },
    { label: 'Sunday', value: 'sunday' }
  ];

  // Trail-specific options
  const actionOptions = [
    { label: 'All Actions', value: '' },
    { label: 'Create', value: 'create' },
    { label: 'Update', value: 'update' },
    { label: 'Delete', value: 'delete' },
    { label: 'Login', value: 'login' },
    { label: 'Logout', value: 'logout' },
    { label: 'Block', value: 'block' },
    { label: 'Unblock', value: 'unblock' },
    { label: 'Config Update', value: 'config_update' }
  ];

  const resourceOptions = [
    { label: 'All Resources', value: '' },
    { label: 'User', value: 'user' },
    { label: 'Organization', value: 'organization' },
    { label: 'System', value: 'system' },
    { label: 'API', value: 'api' },
    { label: 'Email', value: 'email' }
  ];

  const sortOptions = [
    { label: 'Newest First', value: 'desc' },
    { label: 'Oldest First', value: 'asc' }
  ];

  const limitOptions = [
    { label: '25 results', value: 25 },
    { label: '50 results', value: 50 },
    { label: '100 results', value: 100 },
    { label: '200 results', value: 200 }
  ];

  // Auto-set navSection when page loads
  useEffect(() => {
    if (!searchParams.get('navSection')) {
      const currentUrl = window.location.pathname;
      const newUrl = new URL(currentUrl, window.location.origin);
      newUrl.searchParams.set('navSection', 'API Keys');
      router.replace(newUrl.toString());
    }
  }, [searchParams, router]);

  // Load trails when component mounts
  useEffect(() => {
    if (tokens?.accessToken && currentNavSection === 'Audit Trail') {
      handleSearchTrails();
    }
  }, [tokens?.accessToken, currentNavSection]);

  const navigationItems = [
    { key: 'API Keys', label: 'API Keys', active: true },
    { key: 'Support email', label: 'Support email', active: false },
    { key: 'Schedule task', label: 'Schedule task', active: false },
    { key: 'Audit Trail', label: 'Audit Trail', active: false }
  ];

  const handleNavClick = (navSection) => {
    const currentUrl = window.location.pathname;
    const newUrl = new URL(currentUrl, window.location.origin);
    newUrl.searchParams.set('navSection', navSection);
    router.push(newUrl.toString());
  };

  const isItemActive = (itemKey) => {
    return currentNavSection === itemKey;
  };

  // Existing handlers (keeping them as is)
  const handleInputChange = (field, value) => {
    setApiConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEmailConfigChange = (field, value) => {
    setEmailConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleScheduleConfigChange = (field, value) => {
    setScheduleConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProviderChange = (selectedOption) => {
    setApiConfig(prev => ({
      ...prev,
      provider: selectedOption.label
    }));
  };

  const generateApiKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setApiConfig(prev => ({
      ...prev,
      apiKey: result
    }));
    toast.success('API Key generated successfully');
  };

  const handleSave = (configType) => {
    let isValid = true;
    
    switch(configType) {
      case 'api':
        if (!apiConfig.apiKey || !apiConfig.apiSecret) {
          toast.error('Please fill in all API configuration fields');
          isValid = false;
        }
        break;
      case 'email':
        if (!emailConfig.smtpServer || !emailConfig.emailAddress || !emailConfig.password) {
          toast.error('Please fill in all required email fields');
          isValid = false;
        }
        break;
      case 'schedule':
        if (!scheduleConfig.reportRecipients) {
          toast.error('Please provide report recipients email');
          isValid = false;
        }
        break;
    }
    
    if (isValid) {
      toast.success(`${configType.charAt(0).toUpperCase() + configType.slice(1)} configuration saved successfully`);
    }
  };

  const testEmailConnection = () => {
    if (!emailConfig.smtpServer || !emailConfig.emailAddress) {
      toast.error('Please fill in SMTP server and email address first');
      return;
    }
    toast.info('Testing email connection...');
    setTimeout(() => {
      toast.success('Email connection test successful');
    }, 2000);
  };

  // Trail-specific handlers
  const handleSearchFilterChange = (field, value) => {
    setSearchFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearchTrails = async () => {
    if (!tokens?.accessToken) {
      toast.error("Authentication required");
      return;
    }

    // Clean up filters - remove empty values
    const cleanFilters = Object.entries(searchFilters).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});

    const result = await searchTrail(cleanFilters);
    if (!result.success) {
      toast.error(result.error || "Failed to search trails");
    }
  };

  const handleResetFilters = () => {
    setSearchFilters({
      action: '',
      resource: '',
      userId: '',
      startDate: '',
      endDate: '',
      ipAddress: '',
      limit: '50',
      sortBy: 'timestamp',
      sortOrder: 'desc'
    });
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const getActivityDescription = (trail) => {
    const { action, resource, details } = trail;
    
    switch (action?.toLowerCase()) {
      case 'create':
        return `Created ${resource}: ${details?.name || details?.email || 'New item'}`;
      case 'update':
        return `Updated ${resource}: ${details?.name || details?.email || 'Item modified'}`;
      case 'delete':
        return `Deleted ${resource}: ${details?.name || details?.email || 'Item removed'}`;
      case 'login':
        return `User login: ${details?.email || 'User authenticated'}`;
      case 'logout':
        return `User logout: ${details?.email || 'User signed out'}`;
      case 'block':
        return `Blocked user: ${details?.email || details?.name || 'User blocked'}`;
      case 'unblock':
        return `Unblocked user: ${details?.email || details?.name || 'User unblocked'}`;
      case 'config_update':
        return `Config updated: ${details?.configType || 'System configuration'}`;
      default:
        return `${action} ${resource}${details?.name ? `: ${details.name}` : ''}`;
    }
  };

  const getUserInfo = (trail) => {
    if (trail.user) {
      return trail.user.name || trail.user.email || 'Unknown User';
    }
    return 'System';
  };

  const renderContent = () => {
    switch (currentNavSection) {
      case 'Audit Trail':
        return (
          <div className={styles.configContent}>
            <h2>Audit Trail</h2>
            
            <div className={styles.configSection}>
              <div className={styles.searchSection}>
                <div className={styles.searchHeader}>
                  <h3>Search Filters</h3>
                  <button
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className={styles.toggleFiltersBtn}
                  >
                    <MdFilterList />
                    {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
                  </button>
                </div>

                <div className={styles.basicFilters}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Action</label>
                      <FormDropdown
                        options={actionOptions}
                        value={actionOptions.find(opt => opt.value === searchFilters.action)}
                        onSelect={(option) => handleSearchFilterChange('action', option.value)}
                        dropPlaceHolder="Select Action"
                        Icon={<MdInfo />}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Resource</label>
                      <FormDropdown
                        options={resourceOptions}
                        value={resourceOptions.find(opt => opt.value === searchFilters.resource)}
                        onSelect={(option) => handleSearchFilterChange('resource', option.value)}
                        dropPlaceHolder="Select Resource"
                        Icon={<MdStorage />}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Sort Order</label>
                      <FormDropdown
                        options={sortOptions}
                        value={sortOptions.find(opt => opt.value === searchFilters.sortOrder)}
                        onSelect={(option) => handleSearchFilterChange('sortOrder', option.value)}
                        dropPlaceHolder="Sort Order"
                        Icon={<MdSchedule />}
                      />
                    </div>
                  </div>
                </div>

                {showAdvancedFilters && (
                  <div className={styles.advancedFilters}>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>User ID</label>
                        <input
                          type="text"
                          value={searchFilters.userId}
                          onChange={(e) => handleSearchFilterChange('userId', e.target.value)}
                          className={styles.textInput}
                          placeholder="Enter User ID"
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>IP Address</label>
                        <input
                          type="text"
                          value={searchFilters.ipAddress}
                          onChange={(e) => handleSearchFilterChange('ipAddress', e.target.value)}
                          className={styles.textInput}
                          placeholder="Enter IP Address"
                        />
                      </div>
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Start Date</label>
                        <input
                          type="datetime-local"
                          value={searchFilters.startDate}
                          onChange={(e) => handleSearchFilterChange('startDate', e.target.value)}
                          className={styles.textInput}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>End Date</label>
                        <input
                          type="datetime-local"
                          value={searchFilters.endDate}
                          onChange={(e) => handleSearchFilterChange('endDate', e.target.value)}
                          className={styles.textInput}
                        />
                      </div>
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Results Limit</label>
                        <FormDropdown
                          options={limitOptions}
                          value={limitOptions.find(opt => opt.value === parseInt(searchFilters.limit))}
                          onSelect={(option) => handleSearchFilterChange('limit', option.value.toString())}
                          dropPlaceHolder="Results Limit"
                          Icon={<MdFilterList />}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className={styles.searchActions}>
                  <button
                    onClick={handleSearchTrails}
                    className={styles.searchBtn}
                    disabled={loading}
                  >
                    <MdSearch />
                    {loading ? 'Searching...' : 'Search Trails'}
                  </button>
                  <button
                    onClick={handleResetFilters}
                    className={styles.resetBtn}
                  >
                    <MdRefresh />
                    Reset Filters
                  </button>
                </div>
              </div>

              <div className={styles.resultsSection}>
                <div className={styles.resultsHeader}>
                  <h3>Audit Trail Results</h3>
                  <span className={styles.resultsCount}>
                    {trails?.length || 0} result{trails?.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {loading ? (
                  <div className={styles.loadingState}>
                    <div className={styles.loadingSpinner}></div>
                    <span>Loading audit trails...</span>
                  </div>
                ) : trails && trails.length > 0 ? (
                  <div className={styles.trailsList}>
                    {trails.map((trail, index) => (
                      <div key={trail._id || index} className={styles.trailItem}>
                        <div className={styles.trailHeader}>
                          <div className={styles.trailUser}>
                            <MdAccountCircle size={20} />
                            <span>{getUserInfo(trail)}</span>
                          </div>
                          <div className={styles.trailTimestamp}>
                            <MdAccessTime size={16} />
                            <span>{formatTimestamp(trail.timestamp)}</span>
                          </div>
                        </div>
                        <div className={styles.trailContent}>
                          <div className={styles.trailDescription}>
                            {getActivityDescription(trail)}
                          </div>
                          <div className={styles.trailMeta}>
                            {trail.ipAddress && (
                              <span className={styles.trailIp}>IP: {trail.ipAddress}</span>
                            )}
                            {trail.userAgent && (
                              <span className={styles.trailAgent}>
                                User Agent: {trail.userAgent.substring(0, 50)}...
                              </span>
                            )}
                          </div>
                          {trail.details && Object.keys(trail.details).length > 0 && (
                            <div className={styles.trailDetails}>
                              <strong>Details:</strong>
                              <pre>{JSON.stringify(trail.details, null, 2)}</pre>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.emptyState}>
                    <MdSearch size={48} />
                    <h3>No audit trails found</h3>
                    <p>Try adjusting your search filters or check back later.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'API Keys':
        return (
          <div className={styles.configContent}>
            <h2>Api Configuration</h2>
            <div className={styles.configSection}>
              
              <div className={styles.formGroup}>
                <label>Choose api for</label>
                <FormDropdown
                  options={providerOptions}
                  value={providerOptions.find(opt => opt.label === apiConfig.provider)}
                  onSelect={handleProviderChange}
                  dropPlaceHolder="Select API Provider"
                  Icon={<MdStorage />}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Api key</label>
                <div className={styles.inputGroup}>
                  <input
                    type={showApiKey ? "text" : "password"}
                    value={apiConfig.apiKey}
                    onChange={(e) => handleInputChange('apiKey', e.target.value)}
                    className={styles.textInput}
                    placeholder="••••••••••••••••••••••••••••••••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className={styles.visibilityBtn}
                  >
                    {showApiKey ? <MdVisibilityOff /> : <MdVisibility />}
                  </button>
                  <button
                    type="button"
                    onClick={generateApiKey}
                    className={styles.generateBtn}
                  >
                    Regenerate
                  </button>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Api Secret</label>
                <div className={styles.inputGroup}>
                  <input
                    type={showApiSecret ? "text" : "password"}
                    value={apiConfig.apiSecret}
                    onChange={(e) => handleInputChange('apiSecret', e.target.value)}
                    className={styles.textInput}
                    placeholder="••••••••••••••••••••••••••••••••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiSecret(!showApiSecret)}
                    className={styles.visibilityBtn}
                  >
                    {showApiSecret ? <MdVisibilityOff /> : <MdVisibility />}
                  </button>
                </div>
              </div>

              <div className={styles.formActions}>
                <button onClick={() => handleSave('api')} className={styles.saveBtn}>
                  Save API Configuration
                </button>
              </div>
            </div>
          </div>
        );

      case 'Support email':
        return (
          <div className={styles.configContent}>
            <h2>Email Server Configuration</h2>
            <div className={styles.configSection}>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>SMTP Server *</label>
                  <input
                    type="text"
                    value={emailConfig.smtpServer}
                    onChange={(e) => handleEmailConfigChange('smtpServer', e.target.value)}
                    className={styles.textInput}
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Port *</label>
                  <input
                    type="number"
                    value={emailConfig.smtpPort}
                    onChange={(e) => handleEmailConfigChange('smtpPort', e.target.value)}
                    className={styles.textInput}
                    placeholder="587"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Email Address *</label>
                  <input
                    type="email"
                    value={emailConfig.emailAddress}
                    onChange={(e) => handleEmailConfigChange('emailAddress', e.target.value)}
                    className={styles.textInput}
                    placeholder="support@filmcountanization.com"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Password *</label>
                  <div className={styles.inputGroup}>
                    <input
                      type={showEmailPassword ? "text" : "password"}
                      value={emailConfig.password}
                      onChange={(e) => handleEmailConfigChange('password', e.target.value)}
                      className={styles.textInput}
                      placeholder="••••••••••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowEmailPassword(!showEmailPassword)}
                      className={styles.visibilityBtn}
                    >
                      {showEmailPassword ? <MdVisibilityOff /> : <MdVisibility />}
                    </button>
                  </div>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Encryption Type</label>
                  <FormDropdown
                    options={encryptionOptions}
                    value={encryptionOptions.find(opt => opt.value === emailConfig.encryptionType.toLowerCase())}
                    onSelect={(option) => handleEmailConfigChange('encryptionType', option.value)}
                    dropPlaceHolder="Select Encryption"
                    Icon={<MdSecurity />}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Sender Name</label>
                  <input
                    type="text"
                    value={emailConfig.senderName}
                    onChange={(e) => handleEmailConfigChange('senderName', e.target.value)}
                    className={styles.textInput}
                    placeholder="Organization Support"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Reply-To Email</label>
                  <input
                    type="email"
                    value={emailConfig.replyToEmail}
                    onChange={(e) => handleEmailConfigChange('replyToEmail', e.target.value)}
                    className={styles.textInput}
                    placeholder="noreply@filmcountanization.com"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Emails per Hour</label>
                  <input
                    type="number"
                    value={emailConfig.maxEmailsPerHour}
                    onChange={(e) => handleEmailConfigChange('maxEmailsPerHour', e.target.value)}
                    className={styles.textInput}
                    placeholder="100"
                  />
                </div>
              </div>

              <div className={styles.formActions}>
                <button onClick={testEmailConnection} className={styles.testBtn}>
                  Test Connection
                </button>
                <button onClick={() => handleSave('email')} className={styles.saveBtn}>
                  Save Email Configuration
                </button>
              </div>
            </div>
          </div>
        );

      case 'Schedule task':
        return (
          <div className={styles.configContent}>
            <h2>Automated Task Configuration</h2>
            <div className={styles.configSection}>
              
              <div className={styles.sectionGroup}>
                <h3>System Backup Settings</h3>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Backup Frequency</label>
                    <FormDropdown
                      options={frequencyOptions}
                      value={scheduleConfig.backupFrequency}
                      onSelect={(option) => handleScheduleConfigChange('backupFrequency', option)}
                      dropPlaceHolder="Select Frequency"
                      Icon={<MdSchedule />}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Backup Time</label>
                    <input
                      type="time"
                      value={scheduleConfig.backupTime}
                      onChange={(e) => handleScheduleConfigChange('backupTime', e.target.value)}
                      className={styles.textInput}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.sectionGroup}>
                <h3>System Cleanup Settings</h3>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Frequency</label>
                    <FormDropdown
                      options={frequencyOptions}
                      value={scheduleConfig.cleanupFrequency}
                      onSelect={(option) => handleScheduleConfigChange('cleanupFrequency', option)}
                      dropPlaceHolder="Select Frequency"
                      Icon={<MdSchedule />}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Cleanup Day</label>
                    <FormDropdown
                      options={dayOptions}
                      value={scheduleConfig.cleanupDay}
                      onSelect={(option) => handleScheduleConfigChange('cleanupDay', option)}
                      dropPlaceHolder="Select Day"
                      Icon={<MdSchedule />}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.sectionGroup}>
                <h3>Reporting Settings</h3>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Frequency</label>
                    <FormDropdown
                      options={frequencyOptions}
                      value={scheduleConfig.reportFrequency}
                      onSelect={(option) => handleScheduleConfigChange('reportFrequency', option)}
                      dropPlaceHolder="Select Frequency"
                      Icon={<MdNotifications />}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Recipients *</label>
                    <input
                      type="text"
                      value={scheduleConfig.reportRecipients}
                      onChange={(e) => handleScheduleConfigChange('reportRecipients', e.target.value)}
                      className={styles.textInput}
                      placeholder="admin@filmcount.com, manager@filmcount.com"
                    />
                  </div>
                </div>
              </div>

              <div className={styles.sectionGroup}>
                <h3>Maintenance Settings</h3>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Window</label>
                    <input
                      type="text"
                      value={scheduleConfig.maintenanceWindow}
                      onChange={(e) => handleScheduleConfigChange('maintenanceWindow', e.target.value)}
                      className={styles.textInput}
                      placeholder="03:00-05:00"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Auto Updates</label>
                    <div className={styles.toggleContainer}>
                      <input
                        type="checkbox"
                        id="autoUpdates"
                        checked={scheduleConfig.autoUpdates}
                        onChange={(e) => handleScheduleConfigChange('autoUpdates', e.target.checked)}
                        className={styles.toggleInput}
                      />
                      <label htmlFor="autoUpdates" className={styles.toggleLabel}>
                        Enable automatic system updates during maintenance window
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.formActions}>
                <button onClick={() => handleSave('schedule')} className={styles.saveBtn}>
                  Save Schedule Configuration
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className={styles.configContent}>
            <div className={styles.configSection}>
              <h2>Api Configuration</h2>
              <p>Select a configuration option from the navigation.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={styles.systemConfigContainer}>
      <div className={styles.configNav}>
        {navigationItems.map((item) => (
          <button
            key={item.key}
            className={`${styles.navTab} ${
              isItemActive(item.key) ? styles.navTabActive : ''
            }`}
            onClick={() => handleNavClick(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>
      
      <div className={styles.configMainContent}>
        {renderContent()}
      </div>
    </div>
  );
}