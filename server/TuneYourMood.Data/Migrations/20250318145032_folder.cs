using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TuneYourMood.Data.Migrations
{
    /// <inheritdoc />
    public partial class folder : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Playlist_name",
                table: "songsList");

            migrationBuilder.AddColumn<int>(
                name: "FolderEntityId",
                table: "songsList",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Folders",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    parentId = table.Column<int>(type: "int", nullable: false),
                    FolderName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Folders", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Folders_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_songsList_FolderEntityId",
                table: "songsList",
                column: "FolderEntityId");

            migrationBuilder.CreateIndex(
                name: "IX_Folders_UserId",
                table: "Folders",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_songsList_Folders_FolderEntityId",
                table: "songsList",
                column: "FolderEntityId",
                principalTable: "Folders",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_songsList_Folders_FolderEntityId",
                table: "songsList");

            migrationBuilder.DropTable(
                name: "Folders");

            migrationBuilder.DropIndex(
                name: "IX_songsList_FolderEntityId",
                table: "songsList");

            migrationBuilder.DropColumn(
                name: "FolderEntityId",
                table: "songsList");

            migrationBuilder.AddColumn<string>(
                name: "Playlist_name",
                table: "songsList",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
