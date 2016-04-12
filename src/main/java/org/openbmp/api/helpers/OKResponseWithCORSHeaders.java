/*
 * Copyright (c) 2014-2016 Cisco Systems, Inc. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 *
 */

package org.openbmp.api.helpers;

import javax.ws.rs.core.Response;

public class OKResponseWithCORSHeaders {

    /**
     * Generate REST response including a [json] body with CORS headers
     *
     * @param  body			Formatted body of the message (normally json)
     *
     * @return the formatted rest response along with CORS headers included
     */
    public static Response appendCORStoBody(String body) {

        return Response.status(Response.Status.OK).entity(body).header("Access-Control-Allow-Origin", "*").header("Access-Control-Allow-Headers",
                "origin, content-type, accept, authorization")
                .header("Access-Control-Allow-Credentials", "true")
                .header("Access-Control-Allow-Methods", "GET, POST")
                .allow("OPTIONS").build();
    }
}

