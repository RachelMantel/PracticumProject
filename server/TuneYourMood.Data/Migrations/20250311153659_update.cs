using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TuneYourMood.Data.Migrations
{
    /// <inheritdoc />
    public partial class update : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Roles_usersList_UserEntityId",
                table: "Roles");

            migrationBuilder.DropForeignKey(
                name: "FK_songsList_usersList_UserId",
                table: "songsList");

            migrationBuilder.DropPrimaryKey(
                name: "PK_usersList",
                table: "usersList");

            migrationBuilder.RenameTable(
                name: "usersList",
                newName: "Users");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Users",
                table: "Users",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Roles_Users_UserEntityId",
                table: "Roles",
                column: "UserEntityId",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_songsList_Users_UserId",
                table: "songsList",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Roles_Users_UserEntityId",
                table: "Roles");

            migrationBuilder.DropForeignKey(
                name: "FK_songsList_Users_UserId",
                table: "songsList");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Users",
                table: "Users");

            migrationBuilder.RenameTable(
                name: "Users",
                newName: "usersList");

            migrationBuilder.AddPrimaryKey(
                name: "PK_usersList",
                table: "usersList",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Roles_usersList_UserEntityId",
                table: "Roles",
                column: "UserEntityId",
                principalTable: "usersList",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_songsList_usersList_UserId",
                table: "songsList",
                column: "UserId",
                principalTable: "usersList",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
