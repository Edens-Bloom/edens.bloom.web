"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  ExternalLink,
  Image as ImageIcon,
  Loader,
  RefreshCw,
} from "lucide-react";
import {
  designRequestService,
  type DesignRequestRecord,
} from "@/services/designRequestService";

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const statusClass = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
    case "confirmed":
      return "bg-emerald-100 text-emerald-800";
    case "cancelled":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-amber-100 text-amber-800";
  }
};

export default function DesignRequestsPage() {
  const [requests, setRequests] = useState<DesignRequestRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = async () => {
    setIsLoading(true);
    setError(null);

    try {
      setRequests(await designRequestService.fetchAll());
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Failed to fetch design requests",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchRequests();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <div
      className="page-shell"
      style={{
        marginTop: "60px",
        padding: "2rem",
        minHeight: "100vh",
      }}
    >
      <div className="">
        <div style={{ marginBottom: "1rem" }}>
          <p className="eyebrow">Customer enquiries</p>
          <h1 className="section-title">Custom design requests</h1>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <p className="mt-2 text-slate-600">
              Review customer ideas and follow up on their requested designs.
            </p>
            <button
              type="button"
              onClick={fetchRequests}
              disabled={isLoading}
              style={{
                display: "inline-flex",
                alignItems: "center",
                backgroundColor: "lightgreen",
                padding: "10px 15px",
                borderRadius: "8px",
              }}
            >
              <RefreshCw
                size={16}
                className={isLoading ? "animate-spin" : ""}
              />
            </button>
          </div>
        </div>
      </div>

      {error ? (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      ) : null}

      {isLoading ? (
        <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-[2rem] border border-slate-200 bg-white text-slate-600">
          <Loader size={28} className="animate-spin" />
          <p>Loading design requests...</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-12 text-center text-slate-600">
          No custom design requests yet.
        </div>
      ) : (
        <div
          className="design-requests-list"
          style={{
            background: "white",
            borderRadius: "1rem",
            overflowX: "auto",
            boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
          }}
        >
          <table
            style={{
              width: "100%",
              minWidth: "1050px",
              borderCollapse: "collapse",
              textAlign: "left",
            }}
          >
            <caption className="sr-only">All custom design requests</caption>
            <thead
              style={{
                background: "#f8fafc",
                borderBottom: "1px solid #e2e8f0",
              }}
            >
              <tr>
                <th style={{ padding: "1rem" }}>Customer</th>
                <th style={{ padding: "1rem" }}>Contact</th>
                <th style={{ padding: "1rem", minWidth: "280px" }}>
                  Description
                </th>
                <th style={{ padding: "1rem" }}>Reference</th>
                <th style={{ padding: "1rem" }}>Status</th>
                <th style={{ padding: "1rem" }}>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr
                  key={request.id}
                  style={{
                    borderBottom: "1px solid #edf2f7",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(event) => {
                    event.currentTarget.style.background = "#f7fafc";
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.background = "transparent";
                  }}
                >
                  <td style={{ padding: "1rem" }}>
                    <div style={{ fontWeight: "600" }}>{request.full_name}</div>
                    <div style={{ fontSize: "0.8rem", color: "#a0aec0" }}>
                      Request #{request.id}
                    </div>
                  </td>
                  <td style={{ padding: "1rem", fontSize: "0.9rem" }}>
                    <a
                      href={`tel:${request.phone}`}
                      style={{ display: "block", color: "#4a5568" }}
                    >
                      {request.phone}
                    </a>
                    {request.email ? (
                      <a
                        href={`mailto:${request.email}`}
                        style={{
                          display: "block",
                          maxWidth: "190px",
                          overflow: "hidden",
                          color: "#718096",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {request.email}
                      </a>
                    ) : (
                      <span style={{ color: "#a0aec0" }}>No email</span>
                    )}
                  </td>
                  <td
                    style={{
                      padding: "1rem",
                      maxWidth: "360px",
                      color: "#4a5568",
                      lineHeight: "1.5",
                    }}
                  >
                    {request.description}
                  </td>
                  <td style={{ padding: "1rem" }}>
                    {request.image_url ? (
                      <a
                        href={request.image_url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.6rem",
                          color: "#4a5568",
                          fontSize: "0.85rem",
                          fontWeight: "600",
                        }}
                      >
                        <img
                          src={request.image_url}
                          alt=""
                          style={{
                            objectFit: "cover",
                            borderRadius: "0.3rem",
                            width: "50px",
                            height: "50px",
                          }}
                        />
                        <span>
                          Open <ExternalLink size={13} />
                        </span>
                      </a>
                    ) : (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.4rem",
                          color: "#a0aec0",
                          fontSize: "0.85rem",
                        }}
                      >
                        <ImageIcon size={16} /> None
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusClass(request.status)}`}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "1rem",
                      color: "#718096",
                      fontSize: "0.85rem",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {formatDate(request.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
