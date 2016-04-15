package org.openbmp.api.rest.v1;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.openbmp.api.dto.BGPPeerCountDTO;
import org.openbmp.api.dto.BGPPeerDTO;
import org.openbmp.api.exception.OpenBMPApiException;
import org.openbmp.api.helpers.OKResponseWithCORSHeaders;
import org.openbmp.api.helpers.WrapRootValueForResponseJson;
import org.openbmp.api.jsonresponse.GenericJSONResponse;
import org.openbmp.api.service.BGPPeerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.List;

@Component
@Path("/v1/peers")
@Api(value = "/peers" , description = "Manage BGP Peers" )
public class BGPPeerResource {

    @Autowired
    BGPPeerService bgpPeerServiceImpl;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @ApiOperation(value = "List BGP Peers", notes = "This API retrieves the list of BGP Peers" +
            "<p><u>Input Parameters</u><ul><li><b>withGeo</b> is required</li></ul>")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Success : { bgp peers list }"),
            @ApiResponse(code = 400, message = "Failed : {\"error\":\"error description\", \"status\":\"FAIL\"}")
    })
    public Response getPeers(@QueryParam("limit") Integer limit,
                             @QueryParam("withgeo") Boolean withGeo,
                             @QueryParam("where") String where,
                             @QueryParam("orderby") String orderby) {

        long fetchTime = System.currentTimeMillis();

        GenericJSONResponse jstr = null;
        List<BGPPeerDTO> peersList = new ArrayList<BGPPeerDTO>();

        String searchCriteria = "none";
        try {
            peersList = bgpPeerServiceImpl.findAllPeersBySearchCriteria(searchCriteria,"1",limit, withGeo,where,orderby);

        } catch (OpenBMPApiException e) {
            /*jstr = new ListResponse("ERROR", e.getMessage());*/
            e.printStackTrace();
        }

        jstr = new GenericJSONResponse(8,peersList,peersList.size(),Long.valueOf(121),System.currentTimeMillis() - fetchTime);

        return OKResponseWithCORSHeaders.appendCORStoBody(WrapRootValueForResponseJson.wrapRootValue(jstr,"Peers"));

    }


    @GET
    @Path("/{peerHashId}")
    @Produces(MediaType.APPLICATION_JSON)
    @ApiOperation(value = "List BGP Peers By Peer Hash Id", notes = "This API retrieves the list of BGP Peers by Peer HashId" +
            "<p><u>Input Parameters</u><ul><li><b>withGeo</b> is required</li></ul>")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Success : { bgp peers list by peer hash id}"),
            @ApiResponse(code = 400, message = "Failed : {\"error\":\"error description\", \"status\":\"FAIL\"}")
    })
    public Response getPeersByPeerHashId(@PathParam("peerHashId") String peerHashId,
                                         @QueryParam("limit") Integer limit,
                                         @QueryParam("withgeo") Boolean withGeo,
                                         @QueryParam("where") String where,
                                         @QueryParam("orderby") String orderby) {

        long fetchTime = System.currentTimeMillis();

        GenericJSONResponse jstr = null;
        List<BGPPeerDTO> peersList = new ArrayList<BGPPeerDTO>();

        String searchCriteria = "peerHashId";
        try {
            peersList = bgpPeerServiceImpl.findAllPeersBySearchCriteria(searchCriteria,peerHashId,limit, withGeo,where,orderby);
        } catch (OpenBMPApiException e) {
            /*jstr = new ListResponse("ERROR", e.getMessage());*/
            e.printStackTrace();
        }

        jstr = new GenericJSONResponse(8,peersList,peersList.size(),Long.valueOf(121),System.currentTimeMillis() - fetchTime);

        return OKResponseWithCORSHeaders.appendCORStoBody(WrapRootValueForResponseJson.wrapRootValue(jstr,"Peers"));
    }


    @GET
    @Path("/localip/{LocalIP}")
    @Produces(MediaType.APPLICATION_JSON)
    @ApiOperation(value = "List BGP Peers By Local IP Address", notes = "This API retrieves the list of BGP Peers by Local IP" +
            "<p><u>Input Parameters</u><ul><li><b>withGeo</b> is required</li></ul>")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Success : { bgp peers list by Local IP}"),
            @ApiResponse(code = 400, message = "Failed : {\"error\":\"error description\", \"status\":\"FAIL\"}")
    })
    public Response getPeersByLocalIp(@PathParam("LocalIP") String localIP,
                                         @QueryParam("limit") Integer limit,
                                         @QueryParam("withgeo") Boolean withGeo,
                                         @QueryParam("where") String where,
                                         @QueryParam("orderby") String orderby) {

        long fetchTime = System.currentTimeMillis();

        GenericJSONResponse jstr = null;
        List<BGPPeerDTO> peersList = new ArrayList<BGPPeerDTO>();

        String searchCriteria = "LocalIP";
        try {
            peersList = bgpPeerServiceImpl.findAllPeersBySearchCriteria(searchCriteria,localIP,limit, withGeo,where,orderby);
        } catch (OpenBMPApiException e) {
            /*jstr = new ListResponse("ERROR", e.getMessage());*/
            e.printStackTrace();
        }

        jstr = new GenericJSONResponse(8,peersList,peersList.size(),Long.valueOf(121),System.currentTimeMillis() - fetchTime);

        return OKResponseWithCORSHeaders.appendCORStoBody(WrapRootValueForResponseJson.wrapRootValue(jstr,"Peers"));
    }


    @GET
    @Path("/remoteip/{peerIP}")
    @Produces(MediaType.APPLICATION_JSON)
    @ApiOperation(value = "List BGP Peers By Remote/Peer IP Address", notes = "This API retrieves the list of BGP Peers by Remote/Peer IP" +
            "<p><u>Input Parameters</u><ul><li><b>withGeo</b> is required</li></ul>")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Success : { bgp peers list by Remote/Peer IP}"),
            @ApiResponse(code = 400, message = "Failed : {\"error\":\"error description\", \"status\":\"FAIL\"}")
    })
    public Response getPeersByRemoteIp(@PathParam("peerIP") String peerIP,
                                       @QueryParam("limit") Integer limit,
                                       @QueryParam("withgeo") Boolean withGeo,
                                       @QueryParam("where") String where,
                                       @QueryParam("orderby") String orderby) {

        long fetchTime = System.currentTimeMillis();

        GenericJSONResponse jstr = null;
        List<BGPPeerDTO> peersList = new ArrayList<BGPPeerDTO>();

        String searchCriteria = "peerIP";
        try {
            peersList = bgpPeerServiceImpl.findAllPeersBySearchCriteria(searchCriteria,peerIP,limit, withGeo,where,orderby);
        } catch (OpenBMPApiException e) {
            /*jstr = new ListResponse("ERROR", e.getMessage());*/
            e.printStackTrace();
        }

        jstr = new GenericJSONResponse(8,peersList,peersList.size(),Long.valueOf(121),System.currentTimeMillis() - fetchTime);

        return OKResponseWithCORSHeaders.appendCORStoBody(WrapRootValueForResponseJson.wrapRootValue(jstr,"Peers"));
    }




    @GET
    @Path("/asn/{peerASN}")
    @Produces(MediaType.APPLICATION_JSON)
    @ApiOperation(value = "List BGP Peers By Peer ASN", notes = "This API retrieves the list of BGP Peers by Peer ASN" +
            "<p><u>Input Parameters</u><ul><li><b>withGeo</b> is required</li></ul>")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Success : { bgp peers list by Peer ASN}"),
            @ApiResponse(code = 400, message = "Failed : {\"error\":\"error description\", \"status\":\"FAIL\"}")
    })
    public Response getPeersByIp(@PathParam("peerASN") Integer asn,
                                 @QueryParam("limit") Integer limit,
                                 @QueryParam("withgeo") Boolean withGeo,
                                 @QueryParam("where") String where,
                                 @QueryParam("orderby") String orderby) {

        long fetchTime = System.currentTimeMillis();

        GenericJSONResponse jstr = null;
        List<BGPPeerDTO> peersList = new ArrayList<BGPPeerDTO>();

        String searchCriteria = "peerASN";
        try {
            peersList = bgpPeerServiceImpl.findAllPeersBySearchCriteria(searchCriteria,String.valueOf(asn),limit, withGeo,where,orderby);
        } catch (OpenBMPApiException e) {
            /*jstr = new ListResponse("ERROR", e.getMessage());*/
            e.printStackTrace();
        }

        jstr = new GenericJSONResponse(8,peersList,peersList.size(),Long.valueOf(121),System.currentTimeMillis() - fetchTime);

        return OKResponseWithCORSHeaders.appendCORStoBody(WrapRootValueForResponseJson.wrapRootValue(jstr,"Peers"));

    }



    @GET
    @Path("/type/count")
    @Produces(MediaType.APPLICATION_JSON)
    @ApiOperation(value = "Get BGP Peer Counts By Status IP Version Type", notes = "This API retrieves the BGP Peer Counts By Status IP Version Type")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Success : { bgp peer counts by Status IP Version Type}"),
            @ApiResponse(code = 400, message = "Failed : {\"error\":\"error description\", \"status\":\"FAIL\"}")
    })
    public Response getPeersTypeCount() {

        long fetchTime = System.currentTimeMillis();

        GenericJSONResponse jstr = null;
        List<Object[]> records = new ArrayList<Object[]>();
        List<BGPPeerCountDTO> countRecordsList = new ArrayList<BGPPeerCountDTO>();

        try {
            records = bgpPeerServiceImpl.findBGPPeersRecordsCountByCategory("peerCountsByStatusIP");
        } catch (OpenBMPApiException e) {
            e.printStackTrace();
        }

        int rowSize = records.size();
        int colSize = records.get(1).length;

        for (Object[] record : records) {
            BGPPeerCountDTO bpcDTO = new BGPPeerCountDTO();

            bpcDTO.setIpType(String.valueOf(record[0]));
            bpcDTO.setCount(String.valueOf(record[1]));

            countRecordsList.add(bpcDTO);
        }

        jstr = new GenericJSONResponse(colSize,countRecordsList,rowSize,Long.valueOf(121),System.currentTimeMillis() - fetchTime);

        return OKResponseWithCORSHeaders.appendCORStoBody(WrapRootValueForResponseJson.wrapRootValue(jstr,"Peers"));

    }


    @GET
    @Path("/type/count/router")
    @Produces(MediaType.APPLICATION_JSON)
    @ApiOperation(value = "Get List of Routers with Count of Peers by IP Type", notes = "This API retrieves the List of Routers with Count of Peers by IP Type")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Success : { List of Routers with Count of Peers by IP Type}"),
            @ApiResponse(code = 400, message = "Failed : {\"error\":\"error description\", \"status\":\"FAIL\"}")
    })
    public Response getRouterPeersTypeCount() {

        long fetchTime = System.currentTimeMillis();

        GenericJSONResponse jstr = null;
        List<Object[]> records = new ArrayList<Object[]>();
        List<BGPPeerCountDTO> countRecordsList = new ArrayList<BGPPeerCountDTO>();


        try {
            records = bgpPeerServiceImpl.findBGPPeersRecordsCountByCategory("routersWithCountOfPeersByIPType");
        } catch (OpenBMPApiException e) {
            e.printStackTrace();
        }


        int rowSize = records.size();
        int colSize = records.get(1).length;

        for (Object[] record : records) {
            BGPPeerCountDTO bpcDTO = new BGPPeerCountDTO();

            bpcDTO.setRouterName(String.valueOf(record[0]));
            bpcDTO.setRouterIP(String.valueOf(record[1]));
            bpcDTO.setIpType(String.valueOf(record[2]));
            bpcDTO.setCount(String.valueOf(record[3]));

            countRecordsList.add(bpcDTO);
        }

        jstr = new GenericJSONResponse(colSize,countRecordsList,rowSize,Long.valueOf(121),System.currentTimeMillis() - fetchTime);

        return OKResponseWithCORSHeaders.appendCORStoBody(WrapRootValueForResponseJson.wrapRootValue(jstr,"Peers"));

    }

}
