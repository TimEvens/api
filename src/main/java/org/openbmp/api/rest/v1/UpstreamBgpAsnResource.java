package org.openbmp.api.rest.v1;


import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.openbmp.api.dto.BgpAsnDTO;
import org.openbmp.api.exception.OpenBMPApiException;
import org.openbmp.api.helpers.OKResponseWithCORSHeaders;
import org.openbmp.api.helpers.WrapRootValueForResponseJson;
import org.openbmp.api.jsonresponse.GenericJSONResponse;
import org.openbmp.api.service.UpstreamBgpAsnService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.List;

@Component
@Path("/v1/upstreams")
@Api(value = "/upstreams" , description = "Manage Upstream BGP ASNs" )
public class UpstreamBgpAsnResource {

    @Autowired
    UpstreamBgpAsnService upstreamBgpAsnServiceImpl;

    @GET
    @Path("/{ASN}")
    @Produces(MediaType.APPLICATION_JSON)
    @ApiOperation(value = "List all Upstream ASNs for given ASN", notes = "This API retrieves the list of all Upstream ASNs for given ASN")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Success : { upstream ASNs list for a given ASN }"),
            @ApiResponse(code = 400, message = "Failed : {\"error\":\"error description\", \"status\":\"FAIL\"}")
    })
    public Response getUpstream(@PathParam("ASN") Integer asn) {


        GenericJSONResponse jstr = null;
        List<Object[]> records = new ArrayList<Object[]>();
        List<BgpAsnDTO> upstreamAsnList = new ArrayList<BgpAsnDTO>();

        String searchCriteria = "criteria1";

        try {
            records = upstreamBgpAsnServiceImpl.findAllUpstreamASNsBySearchCriteria(searchCriteria,asn);
        } catch (OpenBMPApiException e) {
            e.printStackTrace();
        }

        int rowSize = records.size();
        int colSize = records.get(1).length;

        for (Object[] record : records) {
            BgpAsnDTO ubaDTO = new BgpAsnDTO();

            ubaDTO.setAsn(String.valueOf(record[0]));
            ubaDTO.setAsName(String.valueOf(record[1]));
            ubaDTO.setCity(String.valueOf(record[2]));
            ubaDTO.setStateProv(String.valueOf(record[3]));
            ubaDTO.setCountry(String.valueOf(record[4]));
            ubaDTO.setOrgName(String.valueOf(record[5]));

            upstreamAsnList.add(ubaDTO);
        }

        jstr = new GenericJSONResponse(colSize,upstreamAsnList,rowSize,Long.valueOf(121),Long.valueOf(133));

        return OKResponseWithCORSHeaders.appendCORStoBody(WrapRootValueForResponseJson.wrapRootValue(jstr,"Upstream BGP ASNs"));

    }



    @GET
    @Path("/{ASN}/count")
    @Produces(MediaType.APPLICATION_JSON)
    @ApiOperation(value = "List all Upstream ASNs for given ASN and count the number of distinct prefixes", notes = "This API retrieves the list of all Upstream ASNs for given ASN and count the number of distinct prefixes")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Success : { upstream ASNs list for a given ASN and count the number of distinct prefixes}"),
            @ApiResponse(code = 400, message = "Failed : {\"error\":\"error description\", \"status\":\"FAIL\"}")
    })
    public Response getUpstreamCount(@PathParam("ASN") Integer asn) {


        GenericJSONResponse jstr = null;
        List<Object[]> records = new ArrayList<Object[]>();
        List<BgpAsnDTO> upstreamAsnList = new ArrayList<BgpAsnDTO>();

        String searchCriteria = "criteria2";

        try {
            records = upstreamBgpAsnServiceImpl.findAllUpstreamASNsBySearchCriteria(searchCriteria,asn);
        } catch (OpenBMPApiException e) {
            e.printStackTrace();
        }

        int rowSize = records.size();
        int colSize = records.get(1).length;

        for (Object[] record : records) {
            BgpAsnDTO ubaDTO = new BgpAsnDTO();

            ubaDTO.setAsn(String.valueOf(record[0]));
            ubaDTO.setPrefixesLearned(String.valueOf(record[1]));
            ubaDTO.setAsName(String.valueOf(record[2]));
            ubaDTO.setCity(String.valueOf(record[3]));
            ubaDTO.setStateProv(String.valueOf(record[4]));
            ubaDTO.setCountry(String.valueOf(record[5]));
            ubaDTO.setOrgName(String.valueOf(record[6]));

            upstreamAsnList.add(ubaDTO);
        }

        jstr = new GenericJSONResponse(colSize,upstreamAsnList,rowSize,Long.valueOf(121),Long.valueOf(133));

        return OKResponseWithCORSHeaders.appendCORStoBody(WrapRootValueForResponseJson.wrapRootValue(jstr,"Upstream BGP ASNs"));

    }




    @GET
    @Path("/{ASN}/peer/count")
    @Produces(MediaType.APPLICATION_JSON)
    @ApiOperation(value = "List all Upstream ASNs for given ASN and count the number of distinct prefixes per peer", notes = "This API retrieves the list of all Upstream ASNs for given ASN and count the number of distinct prefixes per peer")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Success : { upstream ASNs list for a given ASN and count the number of distinct prefixes per peer}"),
            @ApiResponse(code = 400, message = "Failed : {\"error\":\"error description\", \"status\":\"FAIL\"}")
    })
    public Response getUpstreamPeerCount(@PathParam("ASN") Integer asn) {


        GenericJSONResponse jstr = null;
        List<Object[]> records = new ArrayList<Object[]>();
        List<BgpAsnDTO> upstreamAsnList = new ArrayList<BgpAsnDTO>();

        String searchCriteria = "criteria3";

        try {
            records = upstreamBgpAsnServiceImpl.findAllUpstreamASNsBySearchCriteria(searchCriteria,asn);
        } catch (OpenBMPApiException e) {
            e.printStackTrace();
        }

        int rowSize = records.size();
        int colSize = records.get(1).length;

        for (Object[] record : records) {
            BgpAsnDTO ubaDTO = new BgpAsnDTO();

            ubaDTO.setAsn(String.valueOf(record[0]));
            ubaDTO.setPrefixesLearned(String.valueOf(record[1]));
            ubaDTO.setPeerAddr(String.valueOf(record[2]));
            ubaDTO.setPeerHashId(String.valueOf(record[3]));
            ubaDTO.setAsName(String.valueOf(record[4]));
            ubaDTO.setCity(String.valueOf(record[5]));
            ubaDTO.setStateProv(String.valueOf(record[6]));
            ubaDTO.setCountry(String.valueOf(record[7]));
            ubaDTO.setOrgName(String.valueOf(record[8]));

            upstreamAsnList.add(ubaDTO);
        }

        jstr = new GenericJSONResponse(colSize,upstreamAsnList,rowSize,Long.valueOf(121),Long.valueOf(133));

        return OKResponseWithCORSHeaders.appendCORStoBody(WrapRootValueForResponseJson.wrapRootValue(jstr,"Upstream BGP ASNs"));

    }

}
