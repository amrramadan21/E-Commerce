import { HttpContextToken } from '@angular/common/http';

export const API_Version = new HttpContextToken<'v1' | 'v2'>(() => 'v1');