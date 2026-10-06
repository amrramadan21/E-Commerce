import { Routes } from "@angular/router";
import { LoginPageComponent } from "./pages/login-page/login-page.component";
import { RegisterPageComponent } from "./pages/register-page/register-page.component";
import { ForgetPasswordPageComponent } from "./pages/forget-password-page/forget-password-page.component";

export const Auth_Routes: Routes = [
    {
        path: 'login',
        component: LoginPageComponent,
    },
    {
        path: 'register',
        component:RegisterPageComponent,
    },
    {
        path: 'forgot-password',
        component: ForgetPasswordPageComponent,
    }
]