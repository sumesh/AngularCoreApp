using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using System;
using System.IO;

namespace AngularCoreApp
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllersWithViews();

            //// Commented for multple angular app
            //// In production, the Angular files will be served from this directory
            ///
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp";
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            if (!env.IsDevelopment())
            {
                app.UseSpaStaticFiles();
            }

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");
            });

            //app.UseSpa(spa =>
            //{
            //    // To learn more about options for serving an Angular SPA from ASP.NET Core,
            //    // see https://go.microsoft.com/fwlink/?linkid=864501

            //    spa.Options.SourcePath = "ClientApp1";
            //    //spa.Options.DefaultPage = $"/index.html";

            //    if (env.IsDevelopment())
            //    {
            //        spa.UseAngularCliServer(npmScript: "start");
            //    }
            //});


            // for each angular client we want to host. 
            app.Map(new PathString("/admin"), client =>
            {
                if (env.IsDevelopment())
                {
                    StaticFileOptions clientApp1Dist = new StaticFileOptions()
                    {
                        FileProvider = new PhysicalFileProvider(
                                Path.Combine(
                                    Directory.GetCurrentDirectory(),
                                    @"ClientApp1"
                                )
                            )
                    };
                    client.UseSpaStaticFiles(clientApp1Dist);
                    client.UseSpa(spa =>
                    {
                        spa.Options.StartupTimeout = new TimeSpan(0, 5, 0);
                        spa.Options.SourcePath = "ClientApp1";

                        // it will use package.json & will search for start command to run
                        spa.UseAngularCliServer(npmScript: "start");
                    });

                }
                else
                {
                    // Each map gets its own physical path
                    // for it to map the static files to. 
                    StaticFileOptions clientApp1Dist = new StaticFileOptions()
                    {
                        FileProvider = new PhysicalFileProvider(
                                Path.Combine(
                                    Directory.GetCurrentDirectory(),
                                    @"ClientApp1/dist"
                                )
                            )
                    };

                    // Each map its own static files otherwise
                    // it will only ever serve index.html no matter the filename 
                    client.UseSpaStaticFiles(clientApp1Dist);

                    // Each map will call its own UseSpa where
                    // we give its own sourcepath
                    client.UseSpa(spa =>
                    {
                        spa.Options.StartupTimeout = new TimeSpan(0, 5, 0);
                        spa.Options.SourcePath = "ClientApp1";
                        spa.Options.DefaultPageStaticFileOptions = clientApp1Dist;
                    });

                }

            });

            // for each angular client we want to host. 
            app.Map(new PathString("/web"), client =>
            {
                if (env.IsDevelopment())
                {
                    StaticFileOptions clientApp2Dist = new StaticFileOptions()
                    {
                        FileProvider = new PhysicalFileProvider(
                                Path.Combine(
                                    Directory.GetCurrentDirectory(),
                                    @"ClientApp2"
                                )
                            )
                    };
                    client.UseSpaStaticFiles(clientApp2Dist);
                    client.UseSpa(spa =>
                    {
                        spa.Options.StartupTimeout = new TimeSpan(0, 5, 0);
                        spa.Options.SourcePath = "ClientApp2";

                        // it will use package.json & will search for start command to run
                        spa.UseAngularCliServer(npmScript: "start");
                    });

                }
                else
                {
                    // Each map gets its own physical path
                    // for it to map the static files to. 
                    StaticFileOptions clientApp2Dist = new StaticFileOptions()
                    {
                        FileProvider = new PhysicalFileProvider(
                                Path.Combine(
                                    Directory.GetCurrentDirectory(),
                                    @"ClientApp2/dist"
                                )
                            )
                    };

                    // Each map its own static files otherwise
                    // it will only ever serve index.html no matter the filename 
                    client.UseSpaStaticFiles(clientApp2Dist);

                    // Each map will call its own UseSpa where
                    // we give its own sourcepath
                    client.UseSpa(spa =>
                    {
                        spa.Options.StartupTimeout = new TimeSpan(0, 5, 0);
                        spa.Options.SourcePath = "ClientApp2";
                        spa.Options.DefaultPageStaticFileOptions = clientApp2Dist;
                    });

                }

            });
        }
    }
}
