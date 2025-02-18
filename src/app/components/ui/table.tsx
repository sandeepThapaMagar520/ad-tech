import * as React from "react";
import { cn } from "@/lib/utils"; // Assuming you have a utility for handling class names
import Link from "next/link"; // Assuming you're using Next.js for routing

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  wrapperClass?: string;
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, wrapperClass, ...props }, ref) => (
    <div className={cn("overflow-x-auto", wrapperClass)}>
      <table
        ref={ref}
        className={cn(
          "w-full caption-top text-sm rounded-lg border border-default-300",
          className
        )}
        {...props}
      />
    </div>
  )
);
Table.displayName = "Table";

interface TableSectionProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

const TableHeader = React.forwardRef<HTMLTableSectionElement, TableSectionProps>(
  ({ className, ...props }, ref) => (
    <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
  )
);
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<HTMLTableSectionElement, TableSectionProps>(
  ({ className, ...props }, ref) => (
    <tbody
      ref={ref}
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
);
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<HTMLTableSectionElement, TableSectionProps>(
  ({ className, ...props }, ref) => (
    <tfoot
      ref={ref}
      className={cn("bg-muted font-medium", className)}
      {...props}
    />
  )
);
TableFooter.displayName = "TableFooter";

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        "border-b border-default-300 transition-colors data-[state=selected]:bg-muted rounded-lg",
        className
      )}
      {...props}
    />
  )
);
TableRow.displayName = "TableRow";

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableHeaderCellElement> {}

const TableHead = React.forwardRef<HTMLTableHeaderCellElement, TableHeadProps>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        "h-14 px-4 text-center align-middle font-semibold text-sm text-default-800 capitalize rounded-t-lg", // Centered header text
        className
      )}
      {...props}
    />
  )
);
TableHead.displayName = "TableHead";

// Corrected TableCell to support href or onClick
interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  href?: string; // Optional prop for link navigation
  onClick?: () => void; // Optional prop for custom click handling
}

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, href, onClick, children, ...props }, ref) => {
    const content = (
      <td
        ref={ref}
        className={cn(
          "p-4 align-middle text-sm text-default-600 last:text-right rtl:last:text-left font-normal rounded-lg",
          className
        )}
        {...props}
      >
        {children}
      </td>
    );

    // If href is provided, wrap with Link for navigation
    if (href) {
      return (
        <Link href={href} passHref>
          {content} {/* Link automatically wraps with <a> tag */}
        </Link>
      );
    }

    // If onClick is provided, wrap the content in a clickable cell
    if (onClick) {
      return (
        <td
          ref={ref}
          className={cn(
            "p-4 align-middle text-sm text-default-600 last:text-right rtl:last:text-left font-normal rounded-lg cursor-pointer",
            className
          )}
          onClick={onClick}
          {...props}
        >
          {children}
        </td>
      );
    }

    return content; // Default non-link behavior
  }
);

TableCell.displayName = "TableCell";

interface TableCaptionProps extends React.HTMLAttributes<HTMLTableCaptionElement> {}

const TableCaption = React.forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  ({ className, ...props }, ref) => (
    <caption
      ref={ref}
      className={cn("mb-4 text-sm font-medium text-default-700 text-start", className)}
      {...props}
    />
  )
);
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
