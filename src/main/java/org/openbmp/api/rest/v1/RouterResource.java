package org.openbmp.api.rest.v1;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.openbmp.api.dto.RouterDTO;
import org.openbmp.api.exception.OpenBMPApiException;
import org.openbmp.api.helpers.OKResponseWithCORSHeaders;
import org.openbmp.api.helpers.WrapRootValueForResponseJson;
import org.openbmp.api.jsonresponse.RouterListResponse;
import org.openbmp.api.service.RouterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.IOException;
import java.io.StringWriter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@Path("/v1/routers")
@Api(value = "/routers" , description = "Manage Routers" )
public class RouterResource  {

    @Autowired
    RouterService routerServiceImpl;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @ApiOperation(value = "List Routers", notes = "This API retrieves the list of routers" +
            "<p><u>Input Parameters</u><ul><li><b>withGeo</b> is required</li></ul>")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Success : { routers list }"),
            @ApiResponse(code = 400, message = "Failed : {\"error\":\"error description\", \"status\":\"FAIL\"}")
    })
    public Response getRouters(@QueryParam("limit") Integer limit,
                               @QueryParam("withgeo") Boolean withGeo,
                               @QueryParam("where") String where,
                               @QueryParam("orderby") String orderby) {

        RouterListResponse jstr = null;
        List<RouterDTO> routersList = null;
        try {
            routersList = routerServiceImpl.findAllRouters(limit,withGeo,where,orderby);
        } catch (OpenBMPApiException e) {
            /*jstr = new ListResponse("ERROR", e.getMessage());*/
            e.printStackTrace();
        }

        jstr = new RouterListResponse(8,routersList,routersList.size(),Long.valueOf(121),Long.valueOf(133));

        return OKResponseWithCORSHeaders.appendCORStoBody(WrapRootValueForResponseJson.wrapRootValue(jstr,"Routers"));

    }

    @GET
    @Path("/status/count")
    @Produces(MediaType.APPLICATION_JSON)
    @ApiOperation(value = "Get Status of Routers", notes = "This API retrieves the current status of routers")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Success : { routers list with their status }"),
            @ApiResponse(code = 400, message = "Failed : {\"error\":\"error description\", \"status\":\"FAIL\"}")
    })
    public Response getRoutersStatusCount(){

        Map<String,String> statusCountMap = new HashMap<String,String>();

        try {
            statusCountMap = routerServiceImpl.getRoutersStatusCount();
        } catch (OpenBMPApiException e) {
            e.printStackTrace();
        }

        String json = null;
        try {
            StringWriter sw = new StringWriter();

            new ObjectMapper().writer().writeValue(sw,statusCountMap);

            json = sw.toString();
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return OKResponseWithCORSHeaders.appendCORStoBody(WrapRootValueForResponseJson.wrapRootValue(json,"Routers"));

    }

    @GET
    @Path("/status/up")
    @Produces(MediaType.APPLICATION_JSON)
    @ApiOperation(value = "List Routers with Status Up", notes = "This API retrieves the list of routers whose status is up")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Success : { routers list whose status is up}"),
            @ApiResponse(code = 400, message = "Failed : {\"error\":\"error description\", \"status\":\"FAIL\"}")
    })
    public Response getRoutersStatusUp(@QueryParam("limit") Integer limit,
                                       @QueryParam("where") String where,
                                       @QueryParam("orderby") String orderby) {


        RouterListResponse jstr = null;
        List<RouterDTO> routersList = null;

        try {
            // Get data from database
           /* int recordCount = routerServiceImpl.getRecordCountByFilter();*/
            routersList = routerServiceImpl.findAllRoutersUp(limit,where,orderby);
        } catch (OpenBMPApiException e) {
            /*jstr = new ListResponse("ERROR", e.getMessage());*/
            e.printStackTrace();
        }

        jstr = new RouterListResponse(8, routersList,routersList.size(),Long.valueOf(121),Long.valueOf(133));

        return OKResponseWithCORSHeaders.appendCORStoBody(WrapRootValueForResponseJson.wrapRootValue(jstr,"Routers"));

    }



    @GET
    @Path("/status/down")
    @Produces(MediaType.APPLICATION_JSON)
    @ApiOperation(value = "List Routers with Status Down", notes = "This API retrieves the list of routers whose status is down")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Success : { routers list whose status is down}"),
            @ApiResponse(code = 400, message = "Failed : {\"error\":\"error description\", \"status\":\"FAIL\"}")
    })
    public Response getRoutersStatusDown(@QueryParam("limit") Integer limit,
                                         @QueryParam("where") String where,
                                         @QueryParam("orderby") String orderby) {


        RouterListResponse jstr = null;
        List<RouterDTO> routersList = null;

        try {
            // Get data from database
           /* int recordCount = routerServiceImpl.getRecordCountByFilter();*/
            routersList = routerServiceImpl.findAllRoutersDown(limit,where,orderby);
        } catch (OpenBMPApiException e) {
            /*jstr = new ListResponse("ERROR", e.getMessage());*/
            e.printStackTrace();
        }

        jstr = new RouterListResponse(8, routersList,routersList.size(),Long.valueOf(121),Long.valueOf(133));

        return OKResponseWithCORSHeaders.appendCORStoBody(WrapRootValueForResponseJson.wrapRootValue(jstr,"Routers"));

    }


}
