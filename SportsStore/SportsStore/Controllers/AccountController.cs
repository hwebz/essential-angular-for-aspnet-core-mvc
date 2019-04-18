using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SportsStore.Models;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace SportsStore.Controllers
{
    public class AccountController : Controller
    {
        private UserManager<IdentityUser> userManager;
        private SignInManager<IdentityUser> signInManager;
        public AccountController(UserManager<IdentityUser> userMgr,
                               SignInManager<IdentityUser> signInMgr) {
            userManager = userMgr;
            signInManager = signInMgr;
        }
        [HttpGet]
        public IActionResult Login(string returnUrl) {
            ViewBag.returnUrl = returnUrl;
            return View();
        }

        [HttpPost("/api/account/loggedin")]
        public IActionResult IsAuthenticated() {
            if (HttpContext.User.Identity.IsAuthenticated) return Ok();
            return BadRequest();
        }

        [HttpPost("/api/account/login")]
        public async Task<IActionResult> Login([FromBody] LoginViewModel creds,
                string returnUrl) {
            if (ModelState.IsValid) {
                if (await DoLogin(creds)) {
                    //return Redirect(returnUrl ?? "/");
                    return Ok();
                } else {
                    ModelState.AddModelError("", "Invalid username or password");
                }
            }
            //return View(creds);
            return BadRequest();
        }
        [HttpPost("/api/account/logout")]
        public async Task<IActionResult> Logout(string redirectUrl) {
            await signInManager.SignOutAsync();
            //return Redirect(redirectUrl ?? "/");
            return Ok();
        }
        private async Task<bool> DoLogin(LoginViewModel creds) {
            IdentityUser user = await userManager.FindByNameAsync(creds.Name);
            if (user != null) {
                await signInManager.SignOutAsync();
                Microsoft.AspNetCore.Identity.SignInResult result =
                    await signInManager.PasswordSignInAsync(user, creds.Password,
                        false, false);
                return result.Succeeded;
            }
            return false;
        }
    }
}
