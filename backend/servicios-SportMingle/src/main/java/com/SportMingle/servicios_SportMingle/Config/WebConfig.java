package com.SportMingle.servicios_SportMingle.Config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        System.out.println("🟢 WebConfig cargado correctamente.");
        registry
                .addResourceHandler("/uploads/**")
                .addResourceLocations("file:C:/Users/Erick/Documents/repositorio/SportMIngle/uploads/");
    }

}

