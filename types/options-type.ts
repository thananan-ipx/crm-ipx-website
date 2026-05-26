export type DefaultOption = {
  label: string
  value: string
}

export type SearchSelectProps<T = DefaultOption> = {
  options: T[]
  value?: string
  onChange: (value?: string, label?: string) => void
  getValue?: (item: T) => string
  getLabel?: (item: T) => string
  getSubLabel?: (item: T) => string | undefined
  placeholder?: string
  className?: string
  clearable?: boolean
  disabled?: boolean
  disabledOption?: (item: T) => boolean
  hasMore?: boolean
  isLoadingMore?: boolean
  onLoadMore?: () => void
  onSearch?: (value: string) => void
}
