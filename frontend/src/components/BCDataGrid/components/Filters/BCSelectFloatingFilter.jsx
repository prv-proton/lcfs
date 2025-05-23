import { useState, useCallback, useEffect } from 'react'
import { IconButton } from '@mui/material'
import { Clear as ClearIcon } from '@mui/icons-material'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8

export const BCSelectFloatingFilter = ({
  model,
  onModelChange,
  optionsQuery,
  valueKey = 'value',
  labelKey = 'label',
  disabled = false,
  params,
  initialFilterType = 'equals',
  multiple = false,
  initialSelectedValues = []
}) => {
  const [selectedValues, setSelectedValues] = useState(multiple ? [] : '')
  const [options, setOptions] = useState([])
  const { data: optionsData, isLoading, isError, error } = optionsQuery(params)

  useEffect(() => {
    if (optionsData) {
      setOptions(optionsData)
    }
  }, [isLoading])

  useEffect(() => {
    if (!model) {
      setSelectedValues(initialSelectedValues)
      return
    }

    const filterValues = model.filter?.split(',') || []

    if (filterValues.length > 1) {
      const optionExists = options.some(
        (opt) => opt[valueKey]?.toString() === model?.filter?.toString()
      )

      if (!optionExists) {
        const newOptions = [
          { [valueKey]: model?.filter, [labelKey]: model?.filter }
        ]
        setOptions((prev) => [...prev, ...newOptions])
      }
    }
    setSelectedValues(filterValues)
  }, [model])

  const handleChange = (event) => {
    const { options } = event.target
    const newValues = Array.from(options)
      .filter((option) => option.selected)
      .map((option) => option.value)

    if (!multiple) {
      setSelectedValues([newValues[0] || ''])
      onModelChange(
        !newValues[0] || newValues[0] === '0'
          ? null
          : {
              type: initialFilterType,
              filter: newValues[0]
            }
      )
    } else {
      setSelectedValues(newValues)
      onModelChange({
        type: initialFilterType,
        filter: newValues.join(',')
      })
    }
  }

  const handleClear = (event) => {
    event.stopPropagation()
    setSelectedValues([])

    // Remove any dynamically added options
    setOptions(optionsData || [])

    onModelChange(null)
  }

  const renderSelectContent = useCallback(() => {
    if (isLoading) {
      return (
        <option disabled value="">
          Loading...
        </option>
      )
    }

    if (isError) {
      return (
        <option disabled value="">
          Error loading options: {error?.message}
        </option>
      )
    }

    return options.map((option) => (
      <option key={option[valueKey]} value={option[valueKey]}>
        {option[labelKey]}
      </option>
    ))
  }, [isLoading, isError, options, error, valueKey, labelKey])

  return (
    <div
      style={{ position: 'relative', width: '100%' }}
      role="group"
      aria-labelledby="select-filter-label"
    >
      <div
        className="select-container"
        style={{
          maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
        }}
        role="combobox"
        aria-expanded={selectedValues.length > 0}
        aria-controls="select-filter"
      >
        <select
          id="select-filter"
          multiple={multiple}
          value={selectedValues}
          onChange={handleChange}
          disabled={disabled || isLoading}
          aria-multiselectable={multiple}
          aria-disabled={disabled || isLoading}
          aria-describedby={
            isError ? 'select-filter-error' : 'select-filter-description'
          }
          style={{
            color: selectedValues.length > 0 ? '#999' : '#000'
          }}
        >
          <option
            value=""
            disabled={!multiple}
            style={{ display: multiple ? 'none' : 'block' }}
          >
            Select
          </option>
          {renderSelectContent()}
        </select>
        {selectedValues.length > 0 && (
          <IconButton
            size="small"
            sx={{ mr: 2 }}
            onClick={handleClear}
            onMouseDown={(event) => event.stopPropagation()}
            aria-label="Clear selection"
            tabIndex={-1}
          >
            <ClearIcon fontSize="small" />
          </IconButton>
        )}
      </div>
    </div>
  )
}

BCSelectFloatingFilter.displayName = 'BCSelectFloatingFilter'
