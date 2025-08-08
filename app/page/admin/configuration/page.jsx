"use client";

import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/app/store/Auth";
import { useTrailStore } from "@/app/store/Trail";
import { useConfigStore } from "@/app/store/Configs";
import FormDropdown from "@/app/components/FormDropdown";
import styles from "@/app/styles/configuration.module.css";
import { 
  MdVisibility, 
  MdVisibilityOff, 
  MdStorage, 
  MdSearch,
  MdFilterList,
  MdRefresh,
  MdAccountCircle,
  MdAccessTime,
  MdInfo
} from "react-icons/md";

export default function Configuration() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, tokens } = useAuthStore();
  const { trails, loading: trailLoading, searchTrail } = useTrailStore();
  const { configs, loading: configLoading, addConfig, updateConfig, getConfigs, getConfigByKey } = useConfigStore();

  const currentNavSection = searchParams.get('navSection') || 'API Keys';

  // Configuration states - now using actual config keys
  const [apiConfig, setApiConfig] = useState({
    provider: 'Minio',
    apiKey: '',
    apiSecret: ''
  });

  // Trail search states - updated to work with new API
  const [searchFilters, setSearchFilters] = useState({
    action: '',
    resource: '',
    userId: '',
    startDate: '',
    endDate: '',
    ipAddress: '',
    responseCode: '',
    limit: '50'
  });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Visibility states
  const [showApiKey, setShowApiKey] = useState(false);
  const [showApiSecret, setShowApiSecret] = useState(false);

  // Dropdown options - only Minio
  const providerOptions = [
    { label: 'Minio', value: 'minio' }
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

  // Load configs when component mounts
  useEffect(() => {
    if (tokens?.accessToken) {
      loadConfigs();
    }
  }, [tokens?.accessToken]);

  // Load configs from store and populate form states
  useEffect(() => {
    if (configs.length > 0) {
      populateConfigForms();
    }
  }, [configs]);

  // Load trails when audit trail section is active
  useEffect(() => {
    if (tokens?.accessToken && currentNavSection === 'Audit Trail') {
      handleSearchTrails();
    }
  }, [tokens?.accessToken, currentNavSection]);

  const loadConfigs = async () => {
    const result = await getConfigs();
    if (!result.success) {
      toast.error(result.error || "Failed to load configurations");
    }
  };

  const populateConfigForms = () => {
    // API Config
    const minioKey = getConfigByKey('MINIO_ACCESS_KEY');
    const minioSecret = getConfigByKey('MINIO_SECRET_KEY');
    const storageProvider = getConfigByKey('STORAGE_PROVIDER');
    
    if (minioKey || minioSecret || storageProvider) {
      setApiConfig(prev => ({
        ...prev,
        apiKey: minioKey?.value || '',
        apiSecret: minioSecret?.value || '',
        provider: storageProvider?.value || 'Minio'
      }));
    }
  };

  const navigationItems = [
    { key: 'API Keys', label: 'API Keys', active: true },
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

  // Configuration handlers
  const handleInputChange = (field, value) => {
    setApiConfig(prev => ({
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

  const saveConfigToStore = async (key, value, system = true) => {
    const existingConfig = getConfigByKey(key);
    
    if (existingConfig) {
      return await updateConfig({ key, value });
    } else {
      return await addConfig({ key, value, system });
    }
  };

  const handleSave = async (configType) => {
    let isValid = true;
    let configsToSave = [];
    
    if (configType === 'api') {
      if (!apiConfig.apiKey || !apiConfig.apiSecret) {
        toast.error('Please fill in all API configuration fields');
        isValid = false;
      } else {
        configsToSave = [
          { key: 'MINIO_ACCESS_KEY', value: apiConfig.apiKey },
          { key: 'MINIO_SECRET_KEY', value: apiConfig.apiSecret },
          { key: 'STORAGE_PROVIDER', value: apiConfig.provider }
        ];
      }
    }
    
    if (isValid && configsToSave.length > 0) {
      try {
        const promises = configsToSave.map(config => saveConfigToStore(config.key, config.value));
        const results = await Promise.all(promises);
        
        const failedSaves = results.filter(result => !result.success);
        if (failedSaves.length > 0) {
          toast.error('Some configurations failed to save');
        } else {
          toast.success(`${configType.charAt(0).toUpperCase() + configType.slice(1)} configuration saved successfully`);
        }
      } catch (error) {
        toast.error('Failed to save configuration');
      }
    }
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

    // Clean up filters - remove empty values and prepare for API
    const cleanFilters = Object.entries(searchFilters).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined && key !== 'limit') {
        // Convert field names to match API expectations
        if (key === 'responseCode' && value) {
          acc[key] = parseInt(value);
        } else if (value !== '') {
          acc[key] = value;
        }
      }
      return acc;
    }, {});

    // Add limit separately as it's used in the request body structure
    cleanFilters.limit = searchFilters.limit;

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
      responseCode: '',
      limit: '50'
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
              <div className={styles.sectionGroup}>
                <h3>Search Filters</h3>
                
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
                </div>

                <div className={styles.formRow}>
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
                  <div className={styles.formGroup}>
                    <label>Response Code</label>
                    <input
                      type="number"
                      value={searchFilters.responseCode}
                      onChange={(e) => handleSearchFilterChange('responseCode', e.target.value)}
                      className={styles.textInput}
                      placeholder="e.g., 200, 404, 500"
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

                <div className={styles.formActions}>
                  <button
                    onClick={handleSearchTrails}
                    className={styles.saveBtn}
                    disabled={trailLoading}
                  >
                    <MdSearch />
                    {trailLoading ? 'Searching...' : 'Search Trails'}
                  </button>
                  <button
                    onClick={handleResetFilters}
                    className={styles.testBtn}
                  >
                    <MdRefresh />
                    Reset Filters
                  </button>
                </div>
              </div>

              <div className={styles.sectionGroup}>
                <h3>Audit Trail Results ({trails?.length || 0} result{trails?.length !== 1 ? 's' : ''})</h3>

                {trailLoading ? (
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
                            {trail.responseCode && (
                              <span className={styles.trailResponseCode}>
                                Status: {trail.responseCode}
                              </span>
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
      default:
        return (
          <div className={styles.configContent}>
            <h2>Api Configuration</h2>
            <div className={styles.configSection}>
              <div className={styles.sectionGroup}>
                <h3>Storage Provider Settings</h3>
                
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
                  <button 
                    onClick={() => handleSave('api')} 
                    className={styles.saveBtn}
                    disabled={configLoading}
                  >
                    {configLoading ? 'Saving...' : 'Save API Configuration'}
                  </button>
                </div>
              </div>
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