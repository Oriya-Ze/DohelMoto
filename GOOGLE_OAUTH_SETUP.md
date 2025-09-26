# הגדרת Google OAuth - הוראות מפורטות

## שלב 1: יצירת פרויקט ב-Google Cloud Console

1. לך ל-[Google Cloud Console](https://console.cloud.google.com/)
2. צור פרויקט חדש או בחר פרויקט קיים
3. הפעל את Google+ API (או Google Identity API)

## שלב 2: הגדרת OAuth Consent Screen

1. בחר "APIs & Services" > "OAuth consent screen"
2. בחר "External" (אלא אם כן יש לך Google Workspace)
3. מלא את הפרטים הבאים:
   - **App name**: DohelMoto (או השם שלך)
   - **User support email**: האימייל שלך
   - **Developer contact information**: האימייל שלך
4. הוסף את הדומיינים הבאים ל-**Authorized domains**:
   - `localhost` (לפיתוח)
   - הדומיין שלך (לפרודקשן)

## שלב 3: יצירת OAuth 2.0 Credentials

1. לך ל-"APIs & Services" > "Credentials"
2. לחץ על "Create Credentials" > "OAuth 2.0 Client IDs"
3. בחר "Web application"
4. מלא את הפרטים הבאים:

### Authorized JavaScript origins:
```
http://localhost:3000
http://localhost:8080
https://yourdomain.com
```

### Authorized redirect URIs:
```
http://localhost:3000
http://localhost:8080
https://yourdomain.com
```

## שלב 4: קבלת המפתחות

אחרי יצירת ה-OAuth Client, תקבל:
- **Client ID**: `14699536724-etdb0dco7r53sepk33p9356aaechv2l8.apps.googleusercontent.com`
- **Client Secret**: (תקבל מפתח סודי חדש)

## שלב 5: הגדרת משתני הסביבה

צור קובץ `.env` בשורש הפרויקט עם התוכן הבא:

```env
# Google OAuth
GOOGLE_CLIENT_ID=14699536724-etdb0dco7r53sepk33p9356aaechv2l8.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# Frontend Environment Variables
REACT_APP_GOOGLE_CLIENT_ID=14699536724-etdb0dco7r53sepk33p9356aaechv2l8.apps.googleusercontent.com
```

## שלב 6: בדיקת ההגדרה

1. הפעל את השרת:
   ```bash
   # Backend
   cd backend
   python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   
   # Frontend
   cd frontend
   npm start
   ```

2. לך ל-`http://localhost:3000/login`
3. לחץ על "Sign in with Google"
4. אם הכל עובד, תראה popup של Google עם אפשרות התחברות

## פתרון בעיות נפוצות

### שגיאה: "Invalid client"
- ודא שה-Client ID נכון
- ודא שה-JavaScript origins כוללים את הדומיין שלך

### שגיאה: "redirect_uri_mismatch"
- ודא שה-Authorized redirect URIs כוללים את הדומיין המדויק

### שגיאה: "access_denied"
- ודא שה-OAuth consent screen מוגדר נכון
- ודא שהדומיין מופיע ב-Authorized domains

## כתובות שצריכות להיות מוגדרות ב-Google Console:

### לפתחות מקומית:
- **JavaScript origins**: `http://localhost:3000`, `http://localhost:8080`
- **Redirect URIs**: `http://localhost:3000`, `http://localhost:8080`

### לפרודקשן:
- **JavaScript origins**: `https://yourdomain.com`
- **Redirect URIs**: `https://yourdomain.com`

## הערות חשובות:

1. **אבטחה**: לעולם אל תשתף את ה-Client Secret בצד הלקוח
2. **HTTPS**: בפרודקשן, ודא שאתה משתמש ב-HTTPS
3. **דומיינים**: ודא שכל הדומיינים שאתה משתמש בהם מופיעים ב-Google Console
4. **בדיקה**: תמיד בדוק את ההגדרות בפיתוח לפני העברה לפרודקשן

## קישורים שימושיים:

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Identity Services](https://developers.google.com/identity/gsi/web)
- [Google Cloud Console](https://console.cloud.google.com/)
