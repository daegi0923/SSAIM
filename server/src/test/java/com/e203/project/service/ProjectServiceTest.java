package com.e203.project.service;

import com.e203.config.JasyptConfig;
import com.e203.project.dto.request.ProjectCreateRequestDto;
import com.e203.project.dto.request.ProjectMemberCreateRequestDto;
import com.e203.project.entity.Project;
import com.e203.user.entity.User;
import com.e203.user.repository.UserRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@SpringBootTest
@TestPropertySource(properties = "jasypt.encryptor.password=wonderwise123")
public class ProjectServiceTest {

	@BeforeEach
	public void createUser(){
		//User Stub을 이용해서 user 생성
		for(int i=1; i<=2; i++){
			userTestStub(i);
		}
	}
	@Autowired
	JasyptConfig jasyptConfig;
	@Autowired
	UserRepository userRepository ;
	@Autowired
	ProjectService projectService;

	@Test
	@DisplayName("Project가 정상적으로 생성되는 테스트")
	@Transactional
	public void projectCreateTest(){

		ProjectCreateRequestDto dto = createProjectDto();
		boolean project = projectService.createProject(null, dto);

		Assertions.assertTrue(project);
	}

	@Test
	@DisplayName("Project Find All")
	@Transactional
	public void projectFindAllTest() {
		List<Project> projects = projectService.findAll(1);
		for (Project project : projects) {
			project.getProjectMembers().stream().forEach(member -> System.out.println(member.getUser().getUserId()));
		}
	}

	private ProjectCreateRequestDto createProjectDto(){
		ArrayList<ProjectMemberCreateRequestDto> members = createProjectMemberRequest();
		return ProjectCreateRequestDto.builder()
			.title("프로젝트 제목 예시")
			.name("프로젝트 관리자 이름")
			.startDate(LocalDateTime.parse("2023-11-01T00:00:00"))
			.endDate(LocalDateTime.parse("2023-12-01T00:00:00"))
			.teamMembers(members)
			.build();
	}

	private static ArrayList<ProjectMemberCreateRequestDto> createProjectMemberRequest() {
		ArrayList<ProjectMemberCreateRequestDto> dtos = new ArrayList<>();
		for(int i=1; i<=2; i++){
			ProjectMemberCreateRequestDto dto = ProjectMemberCreateRequestDto.builder()
				.id(i)
				.role(2).build();
			dtos.add(dto);
		}
		return dtos;
	}

	private void userTestStub(int userId){
		User user = User.builder().userEmail("test@test.com"+userId)
			.userName("name")
			.userClass(1)
			.userCampus(2)
			.userGeneration(11)
			.userPw("34234234234")
			.userNickname("testset")
			.userBirth(LocalDate.now())
			.userGender(2)
			.userPhone("010-1111-1111")
			.userProfileImage("https:s3//image")
			.userSkills("spring boot")
			.userProfileMessage("안녕하세요")
			.build();
		user.setUserId(userId);
		userRepository.save(user);
	}
}

