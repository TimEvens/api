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
import org.openbmp.api.service.DownstreamBgpAsnService;
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
@Path("/v1/downstreams")
@Api(value = "/downstreams" , description = "Manage Downstream BGP ASNs" )
public class DownstreamBgpAsnResource {

    @Autowired
    DownstreamBgpAsnService downstreamBgpAsnServiceImpl;

    @GET
    @Path("/{ASN}")
    @Produces(MediaType.APPLICATION_JSON)
    @ApiOperation(value = "List all Downstream ASNs for given ASN", notes = "This API retrieves the list of all Downstream ASNs for given ASN")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Success : { downstream ASNs list for a given ASN }"),
            @ApiResponse(code = 400, message = "Failed : {\"error\":\"error description\", \"status\":\"FAIL\"}")
    })
    public Response getDownstream(@PathParam("ASN") Integer asn) {


        GenericJSONResponse jstr = null;
        List<Object[]> records = new ArrayList<Object[]>();
        List<BgpAsnDTO> downstreamAsnList = new ArrayList<BgpAsnDTO>();

        String searchCriteria = "criteria1";

        try {
            records = downstreamBgpAsnServiceImpl.findAllDownstreamASNsBySearchCriteria(searchCriteria,asn);
        } catch (OpenBMPApiException e) {
            e.printStackTrace();
        }

        int rowSize = records.size();
        int colSize = records.get(1).length;

        for (Object[] record : records) {
            BgpAsnDTO dbaDTO = new BgpAsnDTO();

            dbaDTO.setAsn(String.valueOf(record[0]));
            dbaDTO.setAsName(String.valueOf(record[1]));
            dbaDTO.setCity(String.valueOf(record[2]));
            dbaDTO.setStateProv(String.valueOf(record[3]));
            dbaDTO.setCountry(String.valueOf(record[4]));
            dbaDTO.setOrgName(String.valueOf(record[5]));

            downstreamAsnList.add(dbaDTO);
        }

        jstr = new GenericJSONResponse(colSize,downstreamAsnList,rowSize,Long.valueOf(121),Long.valueOf(133));

        return OKResponseWithCORSHeaders.appendCORStoBody(WrapRootValueForResponseJson.wrapRootValue(jstr,"Downstream BGP ASNs"));

    }



    @GET
    @Path("/{ASN}/count")
    @Produces(MediaType.APPLICATION_JSON)
    @ApiOperation(value = "List all Downstream ASNs for given ASN and count the number of distinct prefixes", notes = "This API retrieves the list of all Downstream ASNs for given ASN and count the number of distinct prefixes")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Success : { downstream ASNs list for a given ASN and count the number of distinct prefixes}"),
            @ApiResponse(code = 400, message = "Failed : {\"error\":\"error description\", \"status\":\"FAIL\"}")
    })
    public Response getDownstreamCount(@PathParam("ASN") Integer asn) {


        GenericJSONResponse jstr = null;
        List<Object[]> records = new ArrayList<Object[]>();
        List<BgpAsnDTO> downstreamAsnList = new ArrayList<BgpAsnDTO>();

        String searchCriteria = "criteria2";

        try {
            records = downstreamBgpAsnServiceImpl.findAllDownstreamASNsBySearchCriteria(searchCriteria,asn);
        } catch (OpenBMPApiException e) {
            e.printStackTrace();
        }

        int rowSize = records.size();
        int colSize = records.get(1).length;

        for (Object[] record : records) {
            BgpAsnDTO dbaDTO = new BgpAsnDTO();

            dbaDTO.setAsn(String.valueOf(record[0]));
            dbaDTO.setPrefixesLearned(String.valueOf(record[1]));
            dbaDTO.setAsName(String.valueOf(record[2]));
            dbaDTO.setCity(String.valueOf(record[3]));
            dbaDTO.setStateProv(String.valueOf(record[4]));
            dbaDTO.setCountry(String.valueOf(record[5]));
            dbaDTO.setOrgName(String.valueOf(record[6]));

            downstreamAsnList.add(dbaDTO);
        }

        jstr = new GenericJSONResponse(colSize,downstreamAsnList,rowSize,Long.valueOf(121),Long.valueOf(133));

        return OKResponseWithCORSHeaders.appendCORStoBody(WrapRootValueForResponseJson.wrapRootValue(jstr,"Downstream BGP ASNs"));

    }




    @GET
    @Path("/{ASN}/peer/count")
    @Produces(MediaType.APPLICATION_JSON)
    @ApiOperation(value = "List all Downstream ASNs for given ASN and count the number of distinct prefixes per peer", notes = "This API retrieves the list of all Downstream ASNs for given ASN and count the number of distinct prefixes per peer")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Success : { downstream ASNs list for a given ASN and count the number of distinct prefixes per peer}"),
            @ApiResponse(code = 400, message = "Failed : {\"error\":\"error description\", \"status\":\"FAIL\"}")
    })
    public Response getDownstreamPeerCount(@PathParam("ASN") Integer asn)  {


        GenericJSONResponse jstr = null;
        List<Object[]> records = new ArrayList<Object[]>();
        List<BgpAsnDTO> downstreamAsnList = new ArrayList<BgpAsnDTO>();

        String searchCriteria = "criteria3";

        try {
            records = downstreamBgpAsnServiceImpl.findAllDownstreamASNsBySearchCriteria(searchCriteria,asn);
        } catch (OpenBMPApiException e) {
            e.printStackTrace();
        }

        int rowSize = records.size();
        int colSize = records.get(1).length;

        for (Object[] record : records) {
            BgpAsnDTO dbaDTO = new BgpAsnDTO();

            dbaDTO.setAsn(String.valueOf(record[0]));
            dbaDTO.setPrefixesLearned(String.valueOf(record[1]));
            dbaDTO.setPeerAddr(String.valueOf(record[2]));
            dbaDTO.setPeerHashId(String.valueOf(record[3]));
            dbaDTO.setAsName(String.valueOf(record[4]));
            dbaDTO.setCity(String.valueOf(record[5]));
            dbaDTO.setStateProv(String.valueOf(record[6]));
            dbaDTO.setCountry(String.valueOf(record[7]));
            dbaDTO.setOrgName(String.valueOf(record[8]));

            downstreamAsnList.add(dbaDTO);
        }

        jstr = new GenericJSONResponse(colSize,downstreamAsnList,rowSize,Long.valueOf(121),Long.valueOf(133));

        return OKResponseWithCORSHeaders.appendCORStoBody(WrapRootValueForResponseJson.wrapRootValue(jstr,"Downstream BGP ASNs"));

    }

}
