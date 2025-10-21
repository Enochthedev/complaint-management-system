"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Filter, X, Search, Calendar, SlidersHorizontal } from "lucide-react";

interface FilterState {
  search: string;
  status: string[];
  complaintType: string[];
  dateRange: {
    from: string;
    to: string;
  };
  level: string[];
  sortBy: string;
  sortOrder: "asc" | "desc";
}

interface AdvancedFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onReset: () => void;
}

export function AdvancedFilters({
  filters,
  onFiltersChange,
  onReset,
}: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "in_progress", label: "In Progress" },
    { value: "resolved", label: "Resolved" },
    { value: "rejected", label: "Rejected" },
  ];

  const complaintTypeOptions = [
    { value: "missing_grade", label: "Missing Grade" },
    { value: "result_error", label: "Result Error" },
    { value: "course_registration", label: "Course Registration" },
    { value: "academic_record", label: "Academic Record" },
    { value: "other", label: "Other" },
  ];

  const levelOptions = [
    { value: "100", label: "100 Level" },
    { value: "200", label: "200 Level" },
    { value: "300", label: "300 Level" },
    { value: "400", label: "400 Level" },
    { value: "500", label: "500 Level" },
  ];

  const sortOptions = [
    { value: "created_at", label: "Date Submitted" },
    { value: "last_updated", label: "Last Updated" },
    { value: "course_code", label: "Course Code" },
    { value: "status", label: "Status" },
  ];

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (
    key: "status" | "complaintType" | "level",
    value: string
  ) => {
    const currentArray = filters[key];
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value];
    updateFilter(key, newArray);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status.length > 0) count++;
    if (filters.complaintType.length > 0) count++;
    if (filters.dateRange.from || filters.dateRange.to) count++;
    if (filters.level.length > 0) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search complaints, student names, course codes..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pl-10"
          />
        </div>

        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="relative">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96 p-4" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Advanced Filters</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onReset}
                  className="h-auto p-1"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <Label>Status</Label>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={
                        filters.status.includes(option.value)
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => toggleArrayFilter("status", option.value)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Complaint Type Filter */}
              <div className="space-y-2">
                <Label>Complaint Type</Label>
                <div className="flex flex-wrap gap-2">
                  {complaintTypeOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={
                        filters.complaintType.includes(option.value)
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        toggleArrayFilter("complaintType", option.value)
                      }
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Level Filter */}
              <div className="space-y-2">
                <Label>Student Level</Label>
                <div className="flex flex-wrap gap-2">
                  {levelOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={
                        filters.level.includes(option.value)
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => toggleArrayFilter("level", option.value)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Date Range */}
              <div className="space-y-2">
                <Label>Date Range</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      From
                    </Label>
                    <Input
                      type="date"
                      value={filters.dateRange.from}
                      onChange={(e) =>
                        updateFilter("dateRange", {
                          ...filters.dateRange,
                          from: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">To</Label>
                    <Input
                      type="date"
                      value={filters.dateRange.to}
                      onChange={(e) =>
                        updateFilter("dateRange", {
                          ...filters.dateRange,
                          to: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Sort Options */}
              <div className="space-y-2">
                <Label>Sort By</Label>
                <div className="flex gap-2">
                  <Select
                    value={filters.sortBy}
                    onValueChange={(value) => updateFilter("sortBy", value)}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      updateFilter(
                        "sortOrder",
                        filters.sortOrder === "asc" ? "desc" : "asc"
                      )
                    }
                  >
                    {filters.sortOrder === "asc" ? "↑" : "↓"}
                  </Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <Badge variant="secondary" className="gap-1">
              Search: {filters.search}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => updateFilter("search", "")}
              />
            </Badge>
          )}
          {filters.status.map((status) => (
            <Badge key={status} variant="secondary" className="gap-1">
              Status: {statusOptions.find((s) => s.value === status)?.label}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => toggleArrayFilter("status", status)}
              />
            </Badge>
          ))}
          {filters.complaintType.map((type) => (
            <Badge key={type} variant="secondary" className="gap-1">
              Type: {complaintTypeOptions.find((t) => t.value === type)?.label}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => toggleArrayFilter("complaintType", type)}
              />
            </Badge>
          ))}
          {filters.level.map((level) => (
            <Badge key={level} variant="secondary" className="gap-1">
              Level: {level}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => toggleArrayFilter("level", level)}
              />
            </Badge>
          ))}
          {(filters.dateRange.from || filters.dateRange.to) && (
            <Badge variant="secondary" className="gap-1">
              Date: {filters.dateRange.from || "Start"} -{" "}
              {filters.dateRange.to || "End"}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => updateFilter("dateRange", { from: "", to: "" })}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
