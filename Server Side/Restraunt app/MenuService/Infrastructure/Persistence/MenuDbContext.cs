using MenuService.Core.Entites;
using Microsoft.EntityFrameworkCore;

namespace MenuService.Infrastructure.Persistence
{

    public class MenuDbContext : DbContext
    {
        public MenuDbContext(DbContextOptions<MenuDbContext> options) : base(options) { }


        public DbSet<MenuItem> MenuItems { get; set; }
        public DbSet<Category> Categories { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);


            modelBuilder.Entity<Category>(b =>
            {
                b.HasKey(x => x.Id);
                b.Property(x => x.Name).IsRequired().HasMaxLength(150);
                b.Property(x => x.Description).HasMaxLength(500);
            });


            modelBuilder.Entity<MenuItem>(b =>
            {
                b.HasKey(x => x.Id);
                b.Property(x => x.Name).IsRequired().HasMaxLength(200);
                b.Property(x => x.Description).HasMaxLength(1000);
                b.Property(x => x.Price).HasColumnType("decimal(18,2)");
                b.HasOne(x => x.Category).WithMany();
            });
        }
    }
}
