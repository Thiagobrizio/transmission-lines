import { styled } from "@linaria/react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@repo/ui";
import { Link, useMatches } from "@tanstack/react-router";
import React from "react";

interface BreadcrumbsProps {}

const Breadcrumbs: React.FC<BreadcrumbsProps> = () => {
    const routes = useMatches();
    console.log(routes);
    const filteredRoutes = routes.filter((route) => route.routeContext?.text);
    const crumbs = filteredRoutes.map((match) => ({
        text: match.routeContext.text,
        link: match.pathname,
    }));

    return (
        <Wrapper>
            <Breadcrumb>
                <BreadcrumbList>
                    {crumbs.map((crumb, index) => {
                        if (index === crumbs.length - 1) {
                            return (
                                <BreadcrumbItem key={index}>
                                    <BreadcrumbPage>
                                        {crumb.text}
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            );
                        }
                        return (
                            <>
                                <BreadcrumbItem key={index}>
                                    <BreadcrumbLink asChild>
                                        <Link to={crumb.link}>
                                            {crumb.text}
                                        </Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                            </>
                        );
                    })}
                </BreadcrumbList>
            </Breadcrumb>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    margin-bottom: 2rem;
`;
export default Breadcrumbs;
