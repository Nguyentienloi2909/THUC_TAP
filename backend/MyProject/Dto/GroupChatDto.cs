using MyProject.Entity;

namespace MyProject.Dto
{
    public class GroupChatDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<GroupChatMember> Members { get; set; }
    }
}
