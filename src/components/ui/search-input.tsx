
import * as React from "react"
import { Search, Command } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface SearchInputProps
  extends React.ComponentProps<"input"> {
  showKeyboardShortcut?: boolean
  shortcutKey?: string
  onFocus?: () => void
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, showKeyboardShortcut = false, shortcutKey = "K", onFocus, ...props }, ref) => {
    return (
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
        <Input
          className={cn(
            "pl-10 h-12 text-base border-gray-200 focus:border-electric-indigo focus:ring-electric-indigo/20 bg-white text-slate-gray placeholder:text-gray-500",
            showKeyboardShortcut && "pr-12",
            className
          )}
          onFocus={onFocus}
          ref={ref}
          {...props}
        />
        {showKeyboardShortcut && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1 text-xs text-slate-gray">
            <Command className="w-3 h-3" />
            <span>{shortcutKey}</span>
          </div>
        )}
      </div>
    )
  }
)
SearchInput.displayName = "SearchInput"

export { SearchInput }
