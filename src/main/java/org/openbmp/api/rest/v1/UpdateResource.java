package org.openbmp.api.rest.v1;


import io.swagger.annotations.Api;
import org.openbmp.api.service.BGPPeerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.ws.rs.Path;

@Component
@Path("/v1/updates")
@Api(value = "/updates" , description = "Manage Prefixes Updated" )
public class UpdateResource {

    /*@Autowired
    UpdateService updateServiceImpl;*/
}
