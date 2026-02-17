"use client";

import { Button } from "@/components/custom-ui/Button";
import api from "@/lib/axios";
import { formatDate } from "@/lib/dateFormat";
import { useQuery } from "@tanstack/react-query";

type Props = {
  id?: number;
  onClose: () => void;
};

const ViewAuditModal = ({ id, onClose }: Props) => {

  const { data, isLoading } = useQuery({
    queryKey: ["audit-detail", id],
    queryFn: async () => {
      const res = await api.get(`/api/audit/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  const audit = data;

  if (!id) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      <div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />

      <div className="relative w-full border border-white/20 max-w-2xl bg-primary rounded-2xl shadow-xl overflow-hidden">

        <h2 className="bg-[#141517] text-white text-center py-5 font-semibold">
          Audit Log Details
        </h2>

        <div className="p-6 space-y-4 text-gray-200 text-sm">

          {isLoading && <p>Loading...</p>}

          {!isLoading && (

            <>
              <p>
                <strong>User:</strong>{" "}
                {audit?.userId ?? "N/A"}
              </p>

              <p>
                <strong>Action:</strong>{" "}
                {audit?.action ?? "N/A"}
              </p>

              <p>
                <strong>Organization:</strong>{" "}
                {audit?.organizationId ?? "N/A"}
              </p>

              <p>
                <strong>Time:</strong>{" "}
                {audit?.createdAt
                  ? formatDate(audit?.createdAt)
                  : "N/A"}
              </p>

              <p>
                <strong>Success:</strong>{" "}
                {audit?.success
                  ? "Yes"
                  : "No"}
              </p>

              <div>
                <p className="font-semibold mb-1">
                  Request Data
                </p>
                <pre className="bg-[#363739] p-2 rounded text-xs overflow-x-auto">
                  {JSON.stringify(
                    audit?.requestData ?? {},
                    null,
                    2
                  )}
                </pre>
              </div>

              <div>
                <p className="font-semibold mb-1">
                  Metadata
                </p>
                <pre className="bg-[#363739]  p-2 rounded text-xs overflow-x-auto">
                  {JSON.stringify(
                    audit?.metadata ?? {},
                    null,
                    2
                  )}
                </pre>
              </div>

            </>
          )}

          <div className="flex justify-end">
            <Button onClick={onClose}>
              Close
            </Button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ViewAuditModal;