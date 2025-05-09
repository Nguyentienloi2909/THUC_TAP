using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyProject.Migrations
{
    /// <inheritdoc />
    public partial class updatetable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Display",
                table: "TaskItems",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Display",
                table: "Salaries",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Display",
                table: "Roles",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Display",
                table: "Notifications",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Display",
                table: "Groups",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Display",
                table: "Departments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Display",
                table: "Comments",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Display",
                table: "TaskItems");

            migrationBuilder.DropColumn(
                name: "Display",
                table: "Salaries");

            migrationBuilder.DropColumn(
                name: "Display",
                table: "Roles");

            migrationBuilder.DropColumn(
                name: "Display",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "Display",
                table: "Groups");

            migrationBuilder.DropColumn(
                name: "Display",
                table: "Departments");

            migrationBuilder.DropColumn(
                name: "Display",
                table: "Comments");
        }
    }
}
