import { styled } from "@linaria/react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@repo/ui";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useTranslation } from "react-i18next";

interface DataTableProps<T> {
    data: T[];
    columns: ColumnDef<T, any>[];
}

const DataTable = <T,>({ data, columns }: DataTableProps<T>) => {
    const { t } = useTranslation("general");
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });
    return (
        <TableWrapper>
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                              header.column.columnDef.header,
                                              header.getContext()
                                          )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell
                                        key={cell.id}
                                        align={
                                            (cell.column.columnDef.meta as any)
                                                ?.align
                                        }
                                    >
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <NoResultsCell colSpan={columns.length}>
                                {t("noResults")}
                            </NoResultsCell>
                        </TableRow>
                    )}
                </TableBody>
                {/* <TableFooter>
                    {table.getFooterGroups().map((footerGroup) => (
                        <TableRow key={footerGroup.id}>
                            {footerGroup.headers.map((header) => (
                                <TableCell key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                              header.column.columnDef.footer,
                                              header.getContext()
                                          )}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableFooter> */}
            </Table>
        </TableWrapper>
    );
};

const NoResultsCell = styled(TableCell)`
    height: 6rem;
    text-align: center;
`;

const TableWrapper = styled.div`
    border-radius: 0.375rem;
    border-width: 1px;
`;

export default DataTable;
