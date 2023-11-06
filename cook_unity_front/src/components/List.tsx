import React from "react";
import { MenuItem, Select, SelectChangeEvent, Box } from "@mui/material";

interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  filterValues?: string[];
  onFilterChange?: (value: string) => void;
}

export function List<T extends { id: React.Key }>({
  items,
  renderItem,
  filterValues,
  onFilterChange,
}: ListProps<T>) {
  const handleDropdownChange = (event: SelectChangeEvent) => {
    // Check if onFilterChange is provided before calling it
    if (onFilterChange) {
      onFilterChange(event.target.value as string);
    }
  };

  return (
    <Box sx={{ overflowY: "auto", maxHeight: 600 }}>
      {filterValues &&
        filterValues.length > 0 && ( // Render Select only if filterValues is provided
          <Select
            label="Filter"
            onChange={handleDropdownChange}
            displayEmpty
            defaultValue=""
            sx={{ width: 200, marginBottom: 2 }}
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {filterValues.map((value, index) => (
              <MenuItem key={index} value={value}>
                {value}
              </MenuItem>
            ))}
          </Select>
        )}

      {items.map((item) => (
        <Box key={item.id} sx={{ marginBottom: 2 }}>
          {renderItem(item)}
        </Box>
      ))}
    </Box>
  );
}
