using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using SportsStore.Models;
using System.Threading.Tasks;

namespace SportsStore
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }
        
        public void ConfigureServices(IServiceCollection services)
        {
            // Add user identity
            // dotnet ef migrations add Identity --context IdentityDataContext --project SportsStore

            // dotnet ef database update --context DataContext --project SportsStore
            // dotnet ef database update --context IdentityDataContext --project SportsStore
            services.AddDbContext<IdentityDataContext>(options => options.UseSqlServer(Configuration["Data:Identity:ConnectionString"]));
            services.AddIdentity<IdentityUser, IdentityRole>().AddEntityFrameworkStores<IdentityDataContext>();

            services.AddMvc()
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_2)
                .AddJsonOptions(options => {
                    options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Serialize;
                    options.SerializerSettings.NullValueHandling = NullValueHandling.Ignore;
                });

            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });

            services.AddDbContext<DataContext>(options => options.UseSqlServer(Configuration["Data:Products:ConnectionString"]));

            // Sql Server Cache
            // Add table before use
            // dotnet sql-cache create "Server=localhost,5100;Database=SportsStore;User Id=sa;Password=mySecret123;MultipleActiveResultSets=true" "dbo" "SessionData"
            services.AddDistributedSqlServerCache(options =>
            {
                options.ConnectionString = Configuration["Data:Products:ConnectionString"];
                options.SchemaName = "dbo";
                options.TableName = "SessionData";
            });

            services.AddSession(options =>
            {
                options.CookieName = "SportsStore.Session";
                options.IdleTimeout = System.TimeSpan.FromHours(48);
                options.CookieHttpOnly = false;
            });

            // disable auto-redirect authentication for web services
            services.AddAuthentication(options => {
                options.DefaultScheme = "Cookies";
            }).AddCookie("Cookies", options => {
                options.Cookie.Name = "auth_cookie";
                options.Cookie.SameSite = SameSiteMode.None;
                options.Events = new CookieAuthenticationEvents
                {
                    OnRedirectToLogin = context =>
                    {
                        if (context.Request.Path.StartsWithSegments("/api")
                              && context.Response.StatusCode == 200)
                        {
                            context.Response.StatusCode = 401;
                            return Task.CompletedTask;
                        }
                        else
                        {
                            context.Response.Redirect(context.RedirectUri);
                        }
                        return Task.FromResult<object>(null);
                    }
                };
            });
            //services.Configure<IdentityOptions>(config => {
            //    config.Cookies.ApplicationCookie.Events =
            //        new CookieAuthenticationEvents
            //        {
            //            OnRedirectToLogin = context => {
            //                if (context.Request.Path.StartsWithSegments("/api")
            //                          && context.Response.StatusCode == 200)
            //                {
            //                    context.Response.StatusCode = 401;
            //                }
            //                else
            //                {
            //                    context.Response.Redirect(context.RedirectUri);
            //                }
            //                return Task.FromResult<object>(null);
            //            }
            //        };
            //});

            // CSRF
            services.AddAntiforgery(options =>
            {
                options.HeaderName = "X-XSRF-TOKEN";
            });
        }
        
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory, IAntiforgery antiforgery)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseStatusCodePages();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }

            app.UseSession();
            app.UseAuthentication();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.Use(nextDelegate => context =>
            {
                if (context.Request.Path.StartsWithSegments("/api") || context.Request.Path.StartsWithSegments("/"))
                {
                    context.Response.Cookies.Append("XSRF-TOKEN", antiforgery.GetAndStoreTokens(context).RequestToken);
                }
                return nextDelegate(context);
            });

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=ProductValues}/{action=Index}/{id?}");

                //routes.MapSpaFallbackRoute("angular-fallback", new { controller="Home", action="Index" })
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseAngularCliServer(npmScript: "start");
                }
            });

            SeedData.SeedDatabase(app.ApplicationServices.GetRequiredService<DataContext>());
            IdentitySeedData.SeedDatabase(app);
        }
    }
}
