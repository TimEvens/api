package org.openbmp.api.rest.v1;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.openbmp.api.helpers.OKResponseWithCORSHeaders;
import org.openbmp.api.helpers.WrapRootValueForResponseJson;
import org.openbmp.api.service.WithdrawnService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Component
@Path("/v1/withdrawns")
@Api(value = "/withdrawns" , description = "Manage Prefixes Withdrawn" )
public class WithdrawnResource {

    @Autowired
    WithdrawnService withdrawnServiceImpl;

    @GET
    @Path("/top")
    @Produces(MediaType.APPLICATION_JSON)
    @ApiOperation(value = "List Routers", notes = "This API retrieves the list of routers" +
            "<p><u>Input Parameters</u><ul><li><b>withGeo</b> is required</li></ul>")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Success : { routers list }"),
            @ApiResponse(code = 400, message = "Failed : {\"error\":\"error description\", \"status\":\"FAIL\"}")
    })
    public Response getWithdrawsTop(@QueryParam("searchPeer") String searchPeer,
                                    @QueryParam("searchPrefix") String searchPrefix,
                                    @QueryParam("groupBy") String groupBy,
                                    @QueryParam("joinWhoisPrefix") Boolean joinWhoisPrefix,
                                    @QueryParam("limit") Integer limit,
                                    @QueryParam("startTs") String startTimestamp,
                                    @QueryParam("endTs") String endTimestamp) {

        return OKResponseWithCORSHeaders.appendCORStoBody(WrapRootValueForResponseJson.wrapRootValue("Temp Value", "Withdrawns"));
    }


    @GET
    @Path("/peer/{peerHashId}/top")
    @Produces(MediaType.APPLICATION_JSON)
    @ApiOperation(value = "List Routers", notes = "This API retrieves the list of routers" +
            "<p><u>Input Parameters</u><ul><li><b>withGeo</b> is required</li></ul>")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Success : { routers list }"),
            @ApiResponse(code = 400, message = "Failed : {\"error\":\"error description\", \"status\":\"FAIL\"}")
    })
    public Response getWithdrawnTopByPeer(@PathParam("peerHashId") String peerHashId,
                                          @QueryParam("limit") Integer limit,
                                          @QueryParam("hours") Integer hours,
                                          @QueryParam("ts") String timestamp) {

        return OKResponseWithCORSHeaders.appendCORStoBody(WrapRootValueForResponseJson.wrapRootValue("Temp Value", "Withdrawns"));
    }


    @GET
    @Path("/top/interval/{minutes}")
    @Produces(MediaType.APPLICATION_JSON)
    @ApiOperation(value = "List Routers", notes = "This API retrieves the list of routers" +
            "<p><u>Input Parameters</u><ul><li><b>withGeo</b> is required</li></ul>")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Success : { routers list }"),
            @ApiResponse(code = 400, message = "Failed : {\"error\":\"error description\", \"status\":\"FAIL\"}")
    })
    public Response getWithdrawnTopInterval(@PathParam("minutes") Integer minutes,
                                            @QueryParam("limit") Integer limit,
                                            @QueryParam("ts") String timestamp) {


        return OKResponseWithCORSHeaders.appendCORStoBody(WrapRootValueForResponseJson.wrapRootValue("Temp Value", "Withdrawns"));
    }


    @GET
    @Path("/peer/{peerHashId}/top/interval/{minutes}")
    @Produces(MediaType.APPLICATION_JSON)
    @ApiOperation(value = "List Routers", notes = "This API retrieves the list of routers" +
            "<p><u>Input Parameters</u><ul><li><b>withGeo</b> is required</li></ul>")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Success : { routers list }"),
            @ApiResponse(code = 400, message = "Failed : {\"error\":\"error description\", \"status\":\"FAIL\"}")
    })
    public Response getWithdrawnTopInterval(@PathParam("peerHashId") String peerHashId,
                                            @PathParam("minutes") Integer minutes,
                                            @QueryParam("limit") Integer limit,
                                            @QueryParam("ts") String timestamp) {

        return OKResponseWithCORSHeaders.appendCORStoBody(WrapRootValueForResponseJson.wrapRootValue("Temp Value", "Withdrawns"));
    }

}