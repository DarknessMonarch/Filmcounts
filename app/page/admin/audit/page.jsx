"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/app/store/Auth";
import { useTrailStore } from "@/app/store/Trail";
import Loader from "@/app/components/StateLoader";
import styles from "@/app/styles/audit.module.css";
import FormDropdown from "@/app/components/FormDropdown";
import { 
  MdSearch, 
  MdFilterList, 
  MdRefresh, 
  MdError, 
  MdCheckCircle, 
  MdWarning,
  MdInfo,
  MdExpandMore,
  MdExpandLess,
  MdContentCopy,
  MdDownload
} from "react-icons/md";

export default function AuditTrail() {
  const { trails, loading, searchTrail, clearTrails } = useTrailStore();
  const { accessToken } = useAuthStore();

  const [searchParams, setSearchParams] = useState({
    httpMethod: null,
    responseCode: null,
    requestStatus: null,
    startDate: '',
    endDate: '',
    uri: '',
    remoteAddress: '',
    page: 0,
    size: 10
  });

  const [expandedRows, setExpandedRows] = useState(new Set());
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Dropdown options
  const httpMethodOptions = [
    { label: 'GET', value: 'GET' },
    { label: 'POST', value: 'POST' },
    { label: 'PUT', value: 'PUT' },
    { label: 'DELETE', value: 'DELETE' },
    { label: 'PATCH', value: 'PATCH' }
  ];

  const statusOptions = [
    { label: 'SUCCESS', value: 'SUCCESS' },
    { label: 'ERROR', value: 'ERROR' },
    { label: 'WARNING', value: 'WARNING' }
  ];

  const responseCodeOptions = [
    { label: '200 - OK', value: '200' },
    { label: '201 - Created', value: '201' },
    { label: '400 - Bad Request', value: '400' },
    { label: '401 - Unauthorized', value: '401' },
    { label: '403 - Forbidden', value: '403' },
    { label: '404 - Not Found', value: '404' },
    { label: '500 - Internal Server Error', value: '500' }
  ];

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = async () => {
    if (!accessToken) {
      toast.error('Authentication required');
      return;
    }

    const params = Object.entries(searchParams)
      .filter(([key, value]) => value !== null && value !== '')
      .reduce((acc, [key, value]) => {
        if (typeof value === 'object' && value.value) {
          acc[key] = value.value;
        } else {
          acc[key] = value;
        }
        return acc;
      }, {});

    const result = await searchTrail(params, accessToken);
    
    if (result.success && result.data) {
      setTotalRecords(result.data.total || 0);
      setTotalPages(result.data.pages || 0);
    } else {
      toast.error(result.error || 'Failed to fetch audit trail');
    }
  };

  const handleReset = () => {
    setSearchParams({
      httpMethod: null,
      responseCode: null,
      requestStatus: null,
      startDate: '',
      endDate: '',
      uri: '',
      remoteAddress: '',
      page: 0,
      size: 10
    });
    clearTrails();
  };

  const handlePageChange = (newPage) => {
    setSearchParams(prev => ({ ...prev, page: newPage }));
    setTimeout(handleSearch, 100);
  };

  const toggleRowExpansion = (rowId) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(rowId)) {
        newSet.delete(rowId);
      } else {
        newSet.add(rowId);
      }
      return newSet;
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'SUCCESS':
        return <MdCheckCircle className={styles.statusIconSuccess} />;
      case 'ERROR':
        return <MdError className={styles.statusIconError} />;
      case 'WARNING':
        return <MdWarning className={styles.statusIconWarning} />;
      default:
        return <MdInfo className={styles.statusIconInfo} />;
    }
  };

  const getResponseCodeColor = (code) => {
    if (code >= 200 && code < 300) return styles.responseCodeSuccess;
    if (code >= 400 && code < 500) return styles.responseCodeWarning;
    if (code >= 500) return styles.responseCodeError;
    return styles.responseCodeInfo;
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const exportData = () => {
    const dataStr = JSON.stringify(trails, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit-trail-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.auditContainer}>
      <div className={styles.auditFilters}>
        <h2>Audit Trail</h2>
        
        <div className={styles.filterGrid}>
          <div className={styles.filterRow}>
            <FormDropdown
              options={httpMethodOptions}
              value={searchParams.httpMethod}
              onSelect={(option) => setSearchParams(prev => ({ ...prev, httpMethod: option }))}
              dropPlaceHolder="HTTP Method"
              Icon={<MdFilterList />}
            />
            
            <FormDropdown
              options={responseCodeOptions}
              value={searchParams.responseCode}
              onSelect={(option) => setSearchParams(prev => ({ ...prev, responseCode: option }))}
              dropPlaceHolder="Response Code"
              Icon={<MdFilterList />}
            />
            
            <FormDropdown
              options={statusOptions}
              value={searchParams.requestStatus}
              onSelect={(option) => setSearchParams(prev => ({ ...prev, requestStatus: option }))}
              dropPlaceHolder="Status"
              Icon={<MdFilterList />}
            />
          </div>
          
          <div className={styles.filterRow}>
            <input
              type="text"
              placeholder="URI contains..."
              value={searchParams.uri}
              onChange={(e) => setSearchParams(prev => ({ ...prev, uri: e.target.value }))}
              className={styles.filterInput}
            />
            
            <input
              type="text"
              placeholder="Remote Address"
              value={searchParams.remoteAddress}
              onChange={(e) => setSearchParams(prev => ({ ...prev, remoteAddress: e.target.value }))}
              className={styles.filterInput}
            />
          </div>
          
          <div className={styles.filterRow}>
            <input
              type="datetime-local"
              placeholder="Start Date"
              value={searchParams.startDate}
              onChange={(e) => setSearchParams(prev => ({ ...prev, startDate: e.target.value }))}
              className={styles.filterInput}
            />
            
            <input
              type="datetime-local"
              placeholder="End Date"
              value={searchParams.endDate}
              onChange={(e) => setSearchParams(prev => ({ ...prev, endDate: e.target.value }))}
              className={styles.filterInput}
            />
          </div>
        </div>
        
        <div className={styles.filterActions}>
          <button onClick={handleSearch} className={styles.searchBtn} disabled={loading}>
            {loading ? <Loader /> : <MdSearch />}
            Search
          </button>
          <button onClick={handleReset} className={styles.resetBtn}>
            <MdRefresh />
            Reset
          </button>
          <button onClick={exportData} className={styles.exportBtn} disabled={trails.length === 0}>
            <MdDownload />
            Export
          </button>
        </div>
      </div>

      {/* Results Summary */}
      {totalRecords > 0 && (
        <div className={styles.resultsSummary}>
          Showing {trails.length} of {totalRecords} records (Page {searchParams.page + 1} of {totalPages})
        </div>
      )}

      {/* Audit Trail Table */}
      <div className={styles.auditTable}>
        {loading ? (
          <div className={styles.loadingContainer}>
            <Loader />
            <span>Loading audit trail...</span>
          </div>
        ) : trails.length === 0 ? (
          <div className={styles.emptyState}>
            <MdInfo className={styles.emptyIcon} />
            <h3>No audit records found</h3>
            <p>Try adjusting your search filters</p>
          </div>
        ) : (
          <div className={styles.tableContainer}>
            {trails.map((trail) => (
              <div key={trail.id} className={styles.auditRow}>
                <div className={styles.auditRowHeader} onClick={() => toggleRowExpansion(trail.id)}>
                  <div className={styles.auditRowMain}>
                    <div className={styles.methodAndStatus}>
                      <span className={`${styles.httpMethod} ${styles[trail.httpMethod?.toLowerCase()]}`}>
                        {trail.httpMethod}
                      </span>
                      <span className={`${styles.responseCode} ${getResponseCodeColor(trail.responseCode)}`}>
                        {trail.responseCode}
                      </span>
                      {getStatusIcon(trail.requestStatus)}
                    </div>
                    
                    <div className={styles.uriAndTime}>
                      <span className={styles.uri} title={trail.uri}>
                        {trail.uri}
                      </span>
                      <span className={styles.timestamp}>
                        {formatDateTime(trail.requestTime)}
                      </span>
                    </div>
                    
                    <div className={styles.additionalInfo}>
                      <span className={styles.remoteAddress}>
                        {trail.remoteAddress}
                      </span>
                      <span className={styles.processTime}>
                        {trail.processTime}ms
                      </span>
                    </div>
                  </div>
                  
                  <div className={styles.expandIcon}>
                    {expandedRows.has(trail.id) ? <MdExpandLess /> : <MdExpandMore />}
                  </div>
                </div>
                
                {expandedRows.has(trail.id) && (
                  <div className={styles.auditRowDetails}>
                    <div className={styles.detailsGrid}>
                      <div className={styles.detailSection}>
                        <h4>Request Details</h4>
                        <div className={styles.detailItem}>
                          <label>User Agent:</label>
                          <span>{trail.userAgent}</span>
                        </div>
                        <div className={styles.detailItem}>
                          <label>Account Type:</label>
                          <span>{trail.accountType || 'N/A'}</span>
                        </div>
                        <div className={styles.detailItem}>
                          <label>Query Params:</label>
                          <span>{trail.queryParams || 'None'}</span>
                        </div>
                      </div>
                      
                      <div className={styles.detailSection}>
                        <h4>Response Details</h4>
                        <div className={styles.detailItem}>
                          <label>Response Message:</label>
                          <span>{trail.responseMessage}</span>
                        </div>
                        <div className={styles.detailItem}>
                          <label>Response Time:</label>
                          <span>{formatDateTime(trail.responseTime)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {(trail.headers || trail.responseBody) && (
                      <div className={styles.jsonSections}>
                        {trail.headers && (
                          <div className={styles.jsonSection}>
                            <div className={styles.jsonHeader}>
                              <h4>Headers</h4>
                              <button onClick={() => copyToClipboard(JSON.stringify(trail.headers, null, 2))}>
                                <MdContentCopy />
                              </button>
                            </div>
                            <pre className={styles.jsonContent}>
                              {JSON.stringify(trail.headers, null, 2)}
                            </pre>
                          </div>
                        )}
                        
                        {trail.responseBody && (
                          <div className={styles.jsonSection}>
                            <div className={styles.jsonHeader}>
                              <h4>Response Body</h4>
                              <button onClick={() => copyToClipboard(trail.responseBody)}>
                                <MdContentCopy />
                              </button>
                            </div>
                            <pre className={styles.jsonContent}>
                              {trail.responseBody}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button 
            onClick={() => handlePageChange(searchParams.page - 1)} 
            disabled={searchParams.page === 0}
            className={styles.pageBtn}
          >
            Previous
          </button>
          
          <span className={styles.pageInfo}>
            Page {searchParams.page + 1} of {totalPages}
          </span>
          
          <button 
            onClick={() => handlePageChange(searchParams.page + 1)} 
            disabled={searchParams.page >= totalPages - 1}
            className={styles.pageBtn}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}