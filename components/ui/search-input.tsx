import * as React from 'react'
import { Search } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'

type SearchInputProps = {
  value: string
  onChange: React.ChangeEventHandler<HTMLInputElement>
  placeholder?: string
  className?: string
  inputClassName?: string
}

function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  className,
  inputClassName,
}: SearchInputProps) {
  return (
    <div className={cn('relative w-full', className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={cn('pl-9', inputClassName)}
      />
    </div>
  )
}

export { SearchInput }
