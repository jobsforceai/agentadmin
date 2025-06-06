import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import Button from "../components/ui/Button";
import { Calendar, Search, Check, X, Clock, Edit, User } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useUsersStore } from "../store/users";
import { toast } from "react-toastify";

const MeetingsPage = () => {
  const { getUserMeetings, userMeetings, updateMeetingStatus, isLoading } =
    useUsersStore();
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [editingMeeting, setEditingMeeting] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");

  // Load all meetings on component mount
  useEffect(() => {
    getUserMeetings({});
  }, [getUserMeetings]);

  const handleSearch = () => {
    if (searchQuery) {
      const isEmail = searchQuery.includes("@");
      getUserMeetings({
        ...(isEmail ? { email: searchQuery } : { userId: searchQuery }),
        status:
          selectedStatus !== "all"
            ? (selectedStatus as "scheduled" | "attended" | "cancelled")
            : undefined,
      });
    } else {
      // If no search query, load all meetings
      getUserMeetings({
        status:
          selectedStatus !== "all"
            ? (selectedStatus as "scheduled" | "attended" | "cancelled")
            : undefined,
      });
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    getUserMeetings({
      status:
        selectedStatus !== "all"
          ? (selectedStatus as "scheduled" | "attended" | "cancelled")
          : undefined,
    });
  };

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
    if (searchQuery) {
      const isEmail = searchQuery.includes("@");
      getUserMeetings({
        ...(isEmail ? { email: searchQuery } : { userId: searchQuery }),
        status:
          status !== "all"
            ? (status as "scheduled" | "attended" | "cancelled")
            : undefined,
      });
    } else {
      getUserMeetings({
        status:
          status !== "all"
            ? (status as "scheduled" | "attended" | "cancelled")
            : undefined,
      });
    }
  };

  const handleEditStatus = (meetingId: string, currentStatus: string) => {
    setEditingMeeting(meetingId);
    setNewStatus(currentStatus);
  };

  const handleSaveStatus = async (meetingId: string) => {
    if (newStatus) {
      const success = await updateMeetingStatus({
        meetId: meetingId,
        status: newStatus as "scheduled" | "attended" | "cancelled",
      });

      if (success) {
        toast.success("Meeting status updated successfully");
        setEditingMeeting(null);
        // Refresh the meetings list
        handleSearch();
      } else {
        toast.error("Failed to update meeting status");
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingMeeting(null);
    setNewStatus("");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "attended":
        return <Check className="h-5 w-5 text-green-500" />;
      case "cancelled":
        return <X className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "text-yellow-700 bg-yellow-100";
      case "attended":
        return "text-green-700 bg-green-100";
      case "cancelled":
        return "text-red-700 bg-red-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Meeting Management</h1>
        <div className="text-sm text-gray-600">
          Total Meetings:{" "}
          <span className="font-semibold">{userMeetings.length}</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter Meetings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by user ID or email (leave empty to view all)"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3fe3ff] focus:border-[#3fe3ff]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
              </div>

              <div className="w-full md:w-48">
                <select
                  className="block w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3fe3ff] focus:border-[#3fe3ff]"
                  value={selectedStatus}
                  onChange={(e) => handleStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="attended">Attended</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleSearch} isLoading={isLoading}>
                  Search
                </Button>
                {searchQuery && (
                  <Button variant="outline" onClick={handleClearSearch}>
                    Clear
                  </Button>
                )}
              </div>
            </div>

            {/* Status filter buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedStatus === "all"
                    ? "bg-[#3fe3ff] text-gray-900"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => handleStatusFilter("all")}
              >
                All ({userMeetings.length})
              </button>
              <button
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedStatus === "scheduled"
                    ? "bg-yellow-200 text-yellow-800"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => handleStatusFilter("scheduled")}
              >
                Scheduled (
                {userMeetings.filter((m) => m.status === "scheduled").length})
              </button>
              <button
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedStatus === "attended"
                    ? "bg-green-200 text-green-800"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => handleStatusFilter("attended")}
              >
                Attended (
                {userMeetings.filter((m) => m.status === "attended").length})
              </button>
              <button
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedStatus === "cancelled"
                    ? "bg-red-200 text-red-800"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => handleStatusFilter("cancelled")}
              >
                Cancelled (
                {userMeetings.filter((m) => m.status === "cancelled").length})
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Meeting List</CardTitle>
        </CardHeader>
        <CardContent>
          {userMeetings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timezone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {userMeetings.map((meeting) => (
                    <tr key={meeting._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-500" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {meeting.name || "Unknown User"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {meeting.email || meeting.userId}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-900">
                          {format(parseISO(meeting.date), "MMM d, yyyy")}
                        </div>
                        <div className="text-sm text-gray-500">
                          {meeting.time}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        {meeting.timezone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        {meeting.durationMinutes} minutes
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingMeeting === meeting._id ? (
                          <div className="flex items-center space-x-2">
                            <select
                              value={newStatus}
                              onChange={(e) => setNewStatus(e.target.value)}
                              className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#3fe3ff]"
                            >
                              <option value="scheduled">Scheduled</option>
                              <option value="attended">Attended</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                            <Button
                              size="sm"
                              onClick={() => handleSaveStatus(meeting._id)}
                            >
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancelEdit}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              {getStatusIcon(meeting.status)}
                              <span
                                className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                  meeting.status
                                )}`}
                              >
                                {meeting.status.charAt(0).toUpperCase() +
                                  meeting.status.slice(1)}
                              </span>
                            </div>
                            <button
                              onClick={() =>
                                handleEditStatus(meeting._id, meeting.status)
                              }
                              className="ml-2 text-gray-400 hover:text-gray-600"
                              title="Edit status"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <a
                          href={meeting.meetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Button size="sm" variant="outline">
                            <Calendar className="h-4 w-4 mr-1" />
                            Join
                          </Button>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto" />
              <p className="mt-4 text-gray-500">
                {isLoading
                  ? "Loading meetings..."
                  : "No meetings found for the selected filters."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MeetingsPage;
