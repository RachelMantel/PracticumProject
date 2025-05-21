// import { inject } from "@angular/core"
// import { Router } from "@angular/router"

// export function authGuard() {
//   const router = inject(Router)

//   // Simple check for token existence
//   const token = localStorage.getItem("token")
//   if (!token) {
//     return router.parseUrl("/login")
//   }

//   return true
// }

// export function adminGuard() {
//   const router = inject(Router)

//   // Simple check for token existence
//   const token = localStorage.getItem("token")
//   if (!token) {
//     return router.parseUrl("/login")
//   }

//   // Check if admin (very basic check)
//   try {
//     const payloadBase64 = token.split(".")[1]
//     const payloadJson = atob(payloadBase64)
//     const payload = JSON.parse(payloadJson)

//     const isAdmin = Array.isArray(payload.role) ? payload.role.includes("Admin") : payload.role === "Admin"

//     if (!isAdmin) {
//       return router.parseUrl("/dashboard")
//     }

//     return true
//   } catch (error) {
//     console.error("Error checking admin status:", error)
//     return router.parseUrl("/login")
//   }
// }
