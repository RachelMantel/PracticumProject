// import { Injectable, inject, PLATFORM_ID } from "@angular/core"
// import { HttpClient, HttpHeaders } from "@angular/common/http"
// import { isPlatformBrowser } from "@angular/common"
// import type { Observable } from "rxjs"
// import { Folder } from "../../models/folder.model"

// @Injectable({
//   providedIn: "root",
// })
// export class FolderService {
//   private http = inject(HttpClient)
//   private platformId = inject(PLATFORM_ID)
//   private API_BASE_URL = "https://tuneyourmood-server.onrender.com/api/Folder/"

//   getUserFolders(userId: number): Observable<Folder[]> {
//     return this.http.get<Folder[]>(`${this.API_BASE_URL}user/${userId}`, {
//       headers: this.getAuthHeaders(),
//     })
//   }

//   getFolder(id: number): Observable<Folder> {
//     return this.http.get<Folder>(`${this.API_BASE_URL}${id}`, {
//       headers: this.getAuthHeaders(),
//     })
//   }

//   createFolder(folder: Folder): Observable<Folder> {
//     return this.http.post<Folder>(`${this.API_BASE_URL}`, folder, {
//       headers: this.getAuthHeaders(),
//     })
//   }

//   updateFolder(folder: Folder): Observable<Folder> {
//     return this.http.put<Folder>(`${this.API_BASE_URL}${folder.id}`, folder, {
//       headers: this.getAuthHeaders(),
//     })
//   }

//   deleteFolder(id: number): Observable<any> {
//     return this.http.delete(`${this.API_BASE_URL}${id}`, {
//       headers: this.getAuthHeaders(),
//     })
//   }

//   private getAuthHeaders(): HttpHeaders {
//     let token = ""
//     if (isPlatformBrowser(this.platformId)) {
//       token = localStorage.getItem("token") || ""
//     }

//     return new HttpHeaders({
//       "Content-Type": "application/json",
//       ...(token ? { Authorization: `Bearer ${token}` } : {}),
//     })
//   }
// }

