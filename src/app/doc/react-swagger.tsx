"use client"

import useTheme from "next-theme"
import React from "react"
import SwaggerUI from "swagger-ui-react"

import "swagger-ui-react/swagger-ui.css"

type Props = {
    spec: Record<string, any>
}

function ReactSwagger({ spec }: Props) {
    const { setTheme } = useTheme();


    React.useEffect(() => {
        setTheme('dark');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return <SwaggerUI spec={spec} />
}

export default ReactSwagger