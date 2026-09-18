import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Twitter from "next-auth/providers/twitter";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      authorization: {
        params: {
          scope: [
            "openid",
            "email",
            "profile",
            "https://www.googleapis.com/auth/gmail.readonly",
            "https://www.googleapis.com/auth/gmail.send",
            "https://www.googleapis.com/auth/youtube.readonly",
            "https://www.googleapis.com/auth/youtube.upload",
          ].join(" "),
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
    Twitter({
      clientId: process.env.AUTH_TWITTER_ID!,
      clientSecret: process.env.AUTH_TWITTER_SECRET!,
    }),
    // ⭐ TikTok — Custom provider (contourne le bug NextAuth connu)
    {
      id: "tiktok",
      name: "TikTok",
      type: "oauth",
      authorization: {
        url: "https://www.tiktok.com/v2/auth/authorize/",
        params: {
          client_key: process.env.AUTH_TIKTOK_ID,
          scope: "user.info.basic",
          response_type: "code",
        },
      },
      token: {
        url: "https://open.tiktokapis.com/v2/oauth/token/",
        params: {
          client_key: process.env.AUTH_TIKTOK_ID,
          client_secret: process.env.AUTH_TIKTOK_SECRET,
        },
      },
      userinfo: {
        url: "https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name",
        async request({ tokens }: { tokens: any }) {
          const res = await fetch(
            "https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name",
            {
              headers: {
                Authorization: `Bearer ${tokens.access_token}`,
              },
            }
          );
          const data = await res.json();
          return data.data?.user || {};
        },
      },
      profile(profile: any) {
        return {
          id: profile.open_id || profile.union_id,
          name: profile.display_name || "Utilisateur TikTok",
          image: profile.avatar_url || null,
          email: null,
        };
      },
      clientId: process.env.AUTH_TIKTOK_ID,
      clientSecret: process.env.AUTH_TIKTOK_SECRET,
    },
  ],
  pages: {
    signIn: "/connectors",
  },
});