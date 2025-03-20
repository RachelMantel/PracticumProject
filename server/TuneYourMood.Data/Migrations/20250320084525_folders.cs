using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TuneYourMood.Data.Migrations
{
    /// <inheritdoc />
    public partial class folders : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "FolderId",
                table: "songsList",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FolderId",
                table: "songsList");
        }
    }
}
