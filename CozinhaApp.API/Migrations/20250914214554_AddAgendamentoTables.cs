using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CozinhaApp.API.Migrations
{
    /// <inheritdoc />
    public partial class AddAgendamentoTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Agendamentos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    DataAgendamento = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    ValorTotal = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    Observacoes = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    EnderecoEntrega = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    TelefoneContato = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    PagamentoAntecipado = table.Column<bool>(type: "bit", nullable: false),
                    MetodoPagamento = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    DataPagamento = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DataCriacao = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    DataAtualizacao = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Agendamentos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Agendamentos_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ItensAgendamento",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AgendamentoId = table.Column<int>(type: "int", nullable: false),
                    PratoId = table.Column<int>(type: "int", nullable: false),
                    Quantidade = table.Column<int>(type: "int", nullable: false),
                    PrecoUnitario = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    Observacoes = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ItensAgendamento", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ItensAgendamento_Agendamentos_AgendamentoId",
                        column: x => x.AgendamentoId,
                        principalTable: "Agendamentos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ItensAgendamento_Pratos_PratoId",
                        column: x => x.PratoId,
                        principalTable: "Pratos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Agendamentos_DataAgendamento",
                table: "Agendamentos",
                column: "DataAgendamento");

            migrationBuilder.CreateIndex(
                name: "IX_Agendamentos_Status",
                table: "Agendamentos",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_Agendamentos_UserId",
                table: "Agendamentos",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ItensAgendamento_AgendamentoId",
                table: "ItensAgendamento",
                column: "AgendamentoId");

            migrationBuilder.CreateIndex(
                name: "IX_ItensAgendamento_PratoId",
                table: "ItensAgendamento",
                column: "PratoId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ItensAgendamento");

            migrationBuilder.DropTable(
                name: "Agendamentos");
        }
    }
}
