package com.pawfund.config;

import com.pawfund.entity.*;
import com.pawfund.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ShelterRepository shelterRepository;
    private final PetRepository petRepository;
    private final DonationRepository donationRepository;
    private final CampaignRepository campaignRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) return;

        // ─── Users ────────────────────────────────────────────────
        User admin = userRepository.save(User.builder()
                .username("admin").email("admin@pawfund.com")
                .password(passwordEncoder.encode("admin123"))
                .fullName("Admin PawFund").role(User.Role.ADMIN).verified(true).build());

        User shelterUser1 = userRepository.save(User.builder()
                .username("shelter1").email("shelter1@pawfund.com")
                .password(passwordEncoder.encode("shelter123"))
                .fullName("Trạm Cứu Hộ Sài Gòn").phone("0901234567")
                .role(User.Role.SHELTER).verified(true).build());

        User shelterUser2 = userRepository.save(User.builder()
                .username("shelter2").email("shelter2@pawfund.com")
                .password(passwordEncoder.encode("shelter123"))
                .fullName("Trạm Cứu Hộ Hà Nội").phone("0912345678")
                .role(User.Role.SHELTER).verified(true).build());

        User regularUser = userRepository.save(User.builder()
                .username("user1").email("user1@pawfund.com")
                .password(passwordEncoder.encode("user123"))
                .fullName("Nguyễn Văn A").phone("0987654321")
                .role(User.Role.USER).verified(false).build());

        // ─── Shelters ────────────────────────────────────────────
        Shelter shelter1 = shelterRepository.save(Shelter.builder()
                .user(shelterUser1).name("Trạm Cứu Hộ Động Vật Sài Gòn")
                .description("Trạm cứu hộ chó mèo lớn nhất TP.HCM, chuyên cứu hộ và tìm nhà mới cho thú cưng bị bỏ rơi.")
                .address("123 Nguyễn Văn Linh, Quận 7, TP.HCM").phone("0901234567")
                .email("saigon@rescue.com").status(Shelter.Status.APPROVED).build());

        Shelter shelter2 = shelterRepository.save(Shelter.builder()
                .user(shelterUser2).name("Trạm Cứu Hộ Động Vật Hà Nội")
                .description("Trạm cứu hộ uy tín tại Hà Nội, đã cứu hộ hơn 500 chó mèo trong 5 năm hoạt động.")
                .address("456 Đường Láng, Đống Đa, Hà Nội").phone("0912345678")
                .email("hanoi@rescue.com").status(Shelter.Status.APPROVED).build());

        // ─── Pets ────────────────────────────────────────────────
        petRepository.save(Pet.builder()
                .shelter(shelter1).name("Bông").species(Pet.Species.DOG).breed("Phốc sóc")
                .ageMonths(8).gender(Pet.Gender.FEMALE).size(Pet.Size.SMALL)
                .description("Bông là chú chó Phốc sóc xinh xắn, rất thân thiện và thích chơi đùa.")
                .healthStatus("Khỏe mạnh, đã tiêm vaccine đầy đủ")
                .vaccinationInfo("Vaccine dại, care, parvo – tháng 6/2025")
                .vaccinated(true).neutered(false).status(Pet.Status.AVAILABLE)
                .imageUrl("https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600").build());

        petRepository.save(Pet.builder()
                .shelter(shelter1).name("Miu").species(Pet.Species.CAT).breed("Mèo Anh lông ngắn")
                .ageMonths(12).gender(Pet.Gender.MALE).size(Pet.Size.MEDIUM)
                .description("Miu là chú mèo Anh lông ngắn hiền lành, thích nằm cuộn tròn và ngủ.")
                .healthStatus("Khỏe mạnh, đã triệt sản")
                .vaccinationInfo("Vaccine đầy đủ, kiểm tra sức khỏe định kỳ")
                .vaccinated(true).neutered(true).status(Pet.Status.AVAILABLE)
                .imageUrl("https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600").build());

        petRepository.save(Pet.builder()
                .shelter(shelter1).name("Lucky").species(Pet.Species.DOG).breed("Golden Retriever")
                .ageMonths(24).gender(Pet.Gender.MALE).size(Pet.Size.LARGE)
                .description("Lucky là chú Golden Retriever trung thành và thông minh.")
                .healthStatus("Khỏe mạnh hoàn toàn")
                .vaccinated(true).neutered(true).status(Pet.Status.AVAILABLE)
                .imageUrl("https://images.unsplash.com/photo-1552053831-71594a27632d?w=600").build());

        petRepository.save(Pet.builder()
                .shelter(shelter1).name("Gấu").species(Pet.Species.DOG).breed("Corgi")
                .ageMonths(6).gender(Pet.Gender.MALE).size(Pet.Size.SMALL)
                .description("Gấu là chú Corgi đáng yêu với chân ngắn và tai to.")
                .healthStatus("Đang điều trị viêm da nhẹ, sắp hồi phục")
                .vaccinated(true).neutered(false).status(Pet.Status.IN_TREATMENT)
                .imageUrl("https://images.unsplash.com/photo-1612536057832-2ff7ead58194?w=600").build());

        petRepository.save(Pet.builder()
                .shelter(shelter2).name("Kiki").species(Pet.Species.CAT).breed("Mèo Ba Tư")
                .ageMonths(18).gender(Pet.Gender.FEMALE).size(Pet.Size.MEDIUM)
                .description("Kiki là cô mèo Ba Tư lông dài xinh đẹp. Thích được vuốt ve và rất sạch sẽ.")
                .healthStatus("Khỏe mạnh, đã triệt sản")
                .vaccinated(true).neutered(true).status(Pet.Status.AVAILABLE)
                .imageUrl("https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600").build());

        petRepository.save(Pet.builder()
                .shelter(shelter2).name("Rex").species(Pet.Species.DOG).breed("Husky")
                .ageMonths(36).gender(Pet.Gender.MALE).size(Pet.Size.LARGE)
                .description("Rex là chú Husky mạnh mẽ với đôi mắt xanh. Cần chủ có kinh nghiệm.")
                .healthStatus("Khỏe mạnh hoàn toàn")
                .vaccinated(true).neutered(true).status(Pet.Status.AVAILABLE)
                .imageUrl("https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=600").build());

        petRepository.save(Pet.builder()
                .shelter(shelter2).name("Mochi").species(Pet.Species.CAT).breed("Mèo Munchkin")
                .ageMonths(4).gender(Pet.Gender.FEMALE).size(Pet.Size.SMALL)
                .description("Mochi là cô mèo chân ngắn đang được cứu hộ. Rất cần nhà ở tạm thời.")
                .healthStatus("Đang cứu hộ, chưa kiểm tra đầy đủ")
                .vaccinated(false).neutered(false).status(Pet.Status.RESCUING)
                .imageUrl("https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=600").build());

        petRepository.save(Pet.builder()
                .shelter(shelter2).name("Buddy").species(Pet.Species.DOG).breed("Labrador")
                .ageMonths(15).gender(Pet.Gender.MALE).size(Pet.Size.LARGE)
                .description("Buddy là chú Labrador hiền hậu, rất thích trẻ em và chơi đùa ngoài trời.")
                .healthStatus("Khỏe mạnh, năng động")
                .vaccinated(true).neutered(false).status(Pet.Status.AVAILABLE)
                .imageUrl("https://images.unsplash.com/photo-1579213838058-4a13bf0e5d4b?w=600").build());

        // ─── Donations ───────────────────────────────────────────
        donationRepository.save(Donation.builder()
                .user(regularUser).shelter(shelter1)
                .amount(new BigDecimal("500000")).message("Ủng hộ trạm cứu hộ!")
                .status(Donation.Status.COMPLETED).build());

        donationRepository.save(Donation.builder()
                .user(regularUser).shelter(shelter2)
                .amount(new BigDecimal("300000")).message("Chúc các bé mau tìm được nhà mới!")
                .status(Donation.Status.COMPLETED).build());

        // ─── Campaigns ───────────────────────────────────────────
        campaignRepository.save(Campaign.builder()
                .shelter(shelter1)
                .title("Chữa trị cho 15 chú chó bị tai nạn tháng 6")
                .description("Trạm Sài Gòn tiếp nhận 15 chú chó bị thương do tai nạn giao thông. Chi phí phẫu thuật và điều trị cần 50 triệu đồng. Mọi đóng góp đều được ghi nhận và báo cáo minh bạch.")
                .goalAmount(new BigDecimal("50000000"))
                .currentAmount(new BigDecimal("32000000"))
                .deadline(LocalDateTime.now().plusMonths(1))
                .status(Campaign.Status.ACTIVE).build());

        campaignRepository.save(Campaign.builder()
                .shelter(shelter2)
                .title("Tiêm phòng dại miễn phí 100 thú cưng mùa hè 2025")
                .description("Chương trình tiêm vaccine dại miễn phí cho chó mèo tại trạm và cộng đồng. Bảo vệ sức khỏe cộng đồng, ngăn ngừa dịch bệnh.")
                .goalAmount(new BigDecimal("20000000"))
                .currentAmount(new BigDecimal("20000000"))
                .deadline(LocalDateTime.now().minusDays(10))
                .status(Campaign.Status.COMPLETED).build());

        System.out.println("\n==============================================");
        System.out.println("  ✅ DATA SEEDED SUCCESSFULLY");
        System.out.println("==============================================");
        System.out.println("  Admin:   admin    / admin123");
        System.out.println("  Shelter: shelter1 / shelter123");
        System.out.println("  User:    user1    / user123");
        System.out.println("==============================================\n");
    }
}
