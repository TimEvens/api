package org.openbmp.api.configuration;

import io.swagger.jaxrs.config.BeanConfig;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;

public class SwaggerDocumentSetup extends HttpServlet {

    private static final long serialVersionUID = 1L;


    @Override
    public void init(ServletConfig config) throws ServletException {

        super.init(config);

        BeanConfig beanConfig = new BeanConfig();
        beanConfig.setVersion("1.0.0");
        beanConfig.setTitle( "OpenBMP , DB REST interface to the OpenBMP database" );
        beanConfig.setDescription( "RESTful API's that can be used to retrieve BGP data" );

        beanConfig.setSchemes(new String[]{"http"});
        /*beanConfig.setSchemes(new String[]{"https"});*/
        beanConfig.setHost("localhost:8080");
        /*beanConfig.setHost("www.control2me.com");*/
        beanConfig.setBasePath("/api/rest");
        beanConfig.setResourcePackage( "org.openbmp.api.rest" );

        beanConfig.setScan(true);
    }



}
