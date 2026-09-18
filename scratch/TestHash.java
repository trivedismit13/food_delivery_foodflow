import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class TestHash {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String hash = "$2a$10$wY.u9H/J9Qn2H2H5uS5n/O9.O3/v.w.y/6.L5/t/v/y.Q.a.w.s.q";
        String[] tests = {"password", "password123", "admin", "123456", "12345678", "foodflow", "test", "alice", "bob", "creator"};
        for (String test : tests) {
            if (encoder.matches(test, hash)) {
                System.out.println("Match found: " + test);
                return;
            }
        }
        System.out.println("No match found");
    }
}
